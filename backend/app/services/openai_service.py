import ast
import json
from typing import Any

from openai import OpenAI

from app.core.config import get_settings
from app.schemas import CarouselMasterResponse
from app.services.openai_mocks import (
    MOCK_CAROUSEL_MASTER_JSON,
    MOCK_NARRATIVES,
    mock_carousel_images,
)

NARRATIVES_MODEL = "gpt-4.1-mini"
IMAGES_MODEL = "dall-e-3"


def parse_narrative_content(raw: str) -> list[dict[str, Any]]:
    """Parse OpenAI response to a list of narrative dicts. Handles both JSON and Python literal output."""
    text = (raw or "").strip()
    if not text:
        return []
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    try:
        parsed = ast.literal_eval(text)
        return list(parsed) if isinstance(parsed, list) else []
    except (ValueError, SyntaxError):
        return []


def _client() -> OpenAI:
    key = get_settings().OPENAI_API_KEY
    if not key:
        raise ValueError("OPENAI_API_KEY not configured")
    return OpenAI(api_key=key)


def generate_narratives(prompt: str) -> str:
    if get_settings().USE_MOCK_LLM:
        return MOCK_NARRATIVES

    client = _client()
    resp = client.chat.completions.create(
        model=NARRATIVES_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
    )
    if not resp.choices:
        return ""
    msg = resp.choices[0].message
    return (msg.content or "").strip()


CAROUSEL_MASTER_SYSTEM = (
    "Output valid JSON only. The payload must contain: "
    "'style' (with color_palette and visual_style), a non-empty 'caption', and exactly 5 'slides'. "
    "Each slide must include only role, text, and image_prompt. "
    "Valid role values are: central_thesis, argument, sequence, cta. "
    "The global style must be reused across all 5 image prompts to keep visual consistency."
)


def generate_carousel_master_prompt(prompt: str) -> CarouselMasterResponse:
    if get_settings().USE_MOCK_LLM:
        return CarouselMasterResponse.model_validate_json(MOCK_CAROUSEL_MASTER_JSON)

    # Enforce schema at generation time with OpenAI Structured Outputs to avoid brittle
    # string parsing and keep runtime payloads aligned with our Pydantic contract.
    client = _client()
    resp = client.beta.chat.completions.parse(
        model=NARRATIVES_MODEL,
        messages=[
            {"role": "system", "content": CAROUSEL_MASTER_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        response_format=CarouselMasterResponse,
    )
    if not resp.choices:
        raise ValueError("Empty carousel master response")
    msg = resp.choices[0].message
    if getattr(msg, "refusal", None):
        raise ValueError(f"Model refused carousel master response: {msg.refusal}")
    parsed = getattr(msg, "parsed", None)
    if parsed is None:
        raise ValueError("OpenAI did not return a parsed carousel master response")
    return parsed


def _build_image_prompt(
    slide_prompt: str,
    style: dict | None,
    role: str | None = None,
    slide_text: str | None = None,
) -> str:
    """Combine global style and slide description for a text-free background image.

    Text overlays are handled client-side, so the generated image must contain
    NO rendered text, letters, numbers, or typography of any kind.
    """
    parts = []
    if style:
        cp = (style.get("color_palette") or "").strip()
        vs = (style.get("visual_style") or "").strip()
        if cp or vs:
            style_desc = ", ".join(filter(None, [cp, vs]))
            parts.append(f"Visual style (apply to entire image): {style_desc}.")
    if role:
        parts.append(f"Narrative role for this slide: {role}.")
    parts.append(
        "CRITICAL: Do NOT include any text, words, letters, numbers, captions, titles, "
        "labels, or typography in the image. The image must be purely visual with no "
        "readable text content. Design the composition to work well as a background "
        "for text that will be overlaid later."
    )
    parts.append(f"Scene: {slide_prompt}")
    return " ".join(parts)


def generate_carousel_images(
    slides: list[dict],
    style: dict | None = None,
) -> list[str]:
    if get_settings().USE_MOCK_LLM:
        return mock_carousel_images(slides)

    client = _client()
    urls: list[str] = []
    for slide in slides:
        raw = slide.get("image_prompt") if isinstance(slide, dict) else getattr(slide, "image_prompt", None)
        role = slide.get("role") if isinstance(slide, dict) else getattr(slide, "role", None)
        slide_text = slide.get("text") if isinstance(slide, dict) else getattr(slide, "text", None)
        if not raw:
            urls.append("")
            continue
        prompt = _build_image_prompt(raw, style, role=role, slide_text=slide_text)
        try:
            resp = client.images.generate(
                model=IMAGES_MODEL,
                prompt=prompt,
                size="1024x1024",
                response_format="url",
            )
            if resp.data and len(resp.data) > 0:
                urls.append(resp.data[0].url or "")
            else:
                urls.append("")
        except Exception:
            urls.append("")
    return urls
