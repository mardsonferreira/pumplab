import ast
import json
from typing import Any

from openai import OpenAI

from app.core.config import get_settings
from app.services.openai_mocks import (
    MOCK_CAROUSEL_MASTER_PROMPT,
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


def generate_carousel_master_prompt(prompt: str) -> str:
    if get_settings().USE_MOCK_LLM:
        return MOCK_CAROUSEL_MASTER_PROMPT

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


def generate_carousel_images(slides: list[dict]) -> list[str]:
    if get_settings().USE_MOCK_LLM:
        return mock_carousel_images(slides)

    client = _client()
    urls: list[str] = []
    for slide in slides:
        prompt = slide.get("image_prompt") if isinstance(slide, dict) else getattr(slide, "image_prompt", None)
        if not prompt:
            urls.append("")
            continue
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
