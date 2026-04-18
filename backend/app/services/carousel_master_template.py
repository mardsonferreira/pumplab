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

    Color palette: warm neutrals, soft natural tones, clean whites and creams, balanced saturation—typical of a cohesive Instagram feed
    Visual style: lifestyle photography, natural daylight or soft golden-hour light, shallow depth of field, authentic smartphone or mirrorless look, polished but not overly cinematic

    Rules:

    * Slide 1: image representing the central thesis (use role "central_thesis")
    * Slide 2: image representing the main argument (use role "argument")
    * Slides 3 to 5: narrative sequence (use role "sequence" for 3–4, "cta" for slide 5)
    * Each slide must contain:
    * short, impactful text (max. 12 words) — this text will be overlaid by the user later, NOT rendered inside the image
    * an image_prompt that visually represents the slide’s message in the fitness world (training, gym, athletic lifestyle, recovery, performance—always tied to what that slide is about)
    * CRITICAL for image_prompt: the scene must be unmistakably for a fitness audience—people who train and consume health/fitness content should immediately recognize the niche. Use settings, subjects, wardrobe, and props that belong to that world; avoid generic lifestyle shots that could be about anything.
    * CRITICAL: image_prompts must describe ONLY the visual scene and composition. Do NOT include any text, words, letters, numbers, captions, titles, labels, or typography in the generated images. The images must be purely visual with no readable text content.
    * image_prompts must be:
    * natural, polished Instagram-style photography (not movie-poster cinematic)
    * realistic
    * clearly anchored in fitness / athletic culture and aligned with the slide’s specific idea (not vague “wellness” stock imagery)
    * suitable for Instagram fitness creators and their audience
    * visually consistent with each other
    * designed as background images that work well with text overlaid on top
    * Do not use emojis
    * All generated text must be in Brazilian Portuguese only
    * Do not include any English words, expressions, or structures in the generated content
    * Return ONLY valid JSON
    * Do not include line breaks
    * Caption (field "caption"): write a substantive post caption, not a slogan or one-liner. It must read as a short essay ("redação") in continuous prose, built strictly from the narrative input—use central_thesis, main_argument, and the five steps of narrative_sequence (titles and descriptions) as the sole substantive basis. Structure it in three parts, in this order: (1) Introdução — apresente a tese central de forma clara e objetiva; (2) Desenvolvimento — argumente de modo coerente, integrando a sequência narrativa sem repetir literalmente cada slide; avance a ideia com parágrafos lógicos; (3) Conclusão — feche com uma proposta de intervenção ou encaminhamento prático (o que o leitor pode fazer ou como aplicar o que foi defendido). Prioritize objectivity: defend one clear point of view; avoid filler, unnecessary repetition, and information that does not serve the argument. Aim for roughly 120 to 350 words total (adjust if the narrative is very dense or sparse). The caption must be non-empty and substantially longer than a typical social one-liner.
    * Separate logical parts of the caption with a period and space (or " — " between major sections if needed); do not rely on line breaks inside the caption string.
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
