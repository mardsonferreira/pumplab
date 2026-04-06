"""Server-side carousel master LLM template. User content is only the structured narrative payload."""

from __future__ import annotations

import json

from app.schemas.carousel import CarouselMasterNarrativeBody

# Parity with former `carouselMasterPrompt` in frontend/src/app/hooks/prompt.ts.
CAROUSEL_MASTER_TEMPLATE = """
    You are a senior content strategist and visual prompt engineer.

    Input:
    Narrative: '{{NARRATIVE}}'
    ==========================

    Your task:
    Generate an Instagram carousel with exactly 5 slides based on the provided narrative.
    Preserve the narrative theme and the order of steps (1 to 5) in every slide.

    The narrative consists of:

    * Theme (if present)
    * Central Thesis
    * Main Argument
    * Narrative Sequence (5 steps, in order)

    Color palette: dark tones, black, gray, orange accents
    Visual style: cinematic, realistic, high-contrast lighting

    Rules:

    * Slide 1: image representing the central thesis (use role "central_thesis")
    * Slide 2: image representing the main argument (use role "argument")
    * Slides 3 to 5: narrative sequence (use role "sequence" for 3–4, "cta" for slide 5)
    * Each slide must contain:
    * short, impactful text (max. 12 words) — this text will be overlaid by the user later, NOT rendered inside the image
    * an image_prompt that visually represents the message
    * CRITICAL: image_prompts must describe ONLY the visual scene and composition. Do NOT include any text, words, letters, numbers, captions, titles, labels, or typography in the generated images. The images must be purely visual with no readable text content.
    * image_prompts must be:
    * cinematic
    * realistic
    * focused on fitness mindset
    * suitable for Instagram
    * visually consistent with each other
    * designed as background images that work well with text overlaid on top
    * Do not use emojis
    * All generated text must be in Brazilian Portuguese only
    * Do not include any English words, expressions, or structures in the generated content
    * Return ONLY valid JSON
    * Do not include line breaks
    * Include a non-empty caption field in Brazilian Portuguese
    * Do NOT include explanations, markdown, or additional text
    * Do NOT include newline characters ('\\n') in the output

    JSON format:
    {
        "style": {
                "color_palette": "",
                "visual_style": ""
            },
        "caption": "",
        "slides": [
            {
                "role": "central_thesis | argument | sequence | cta",
                "text": "",
                "image_prompt": ""
            }
        ]
    }
"""


def build_carousel_master_user_message(body: CarouselMasterNarrativeBody) -> str:
    """Serialize validated narrative to JSON and substitute into the master template."""
    payload: dict = {
        "central_thesis": body.central_thesis,
        "main_argument": body.main_argument,
        "narrative_sequence": [s.model_dump() for s in body.narrative_sequence],
    }
    if body.theme is not None:
        payload["theme"] = body.theme
    narrative_str = json.dumps(payload, ensure_ascii=False)
    return CAROUSEL_MASTER_TEMPLATE.replace("{{NARRATIVE}}", narrative_str)
