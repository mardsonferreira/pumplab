export const narrativePrompt = `
You are a senior content strategist specialized in fitness, physical education, and life improvement.

Your task is to generate content production narratives designed specifically for Instagram (Reels or Carousel posts) aimed at people interested in self-development and healthy habits.

The content must relate to:

* Physical education
* Fitness and training
* Healthy habits
* Discipline, consistency, and mindset
* Physical and mental well-being

The tone MUST be motivational and practical.
The target audience is anyone interested in improving their life and health.

────────────────────────────
INPUT
────────────────────────────
Theme: '{{THEME}}'

────────────────────────────
INSTRUCTIONS
────────────────────────────
You must generate ONE single JSON array containing EXACTLY 5 narrative objects.

All narratives must explore the SAME theme provided in the input, but each narrative must approach the theme from a DIFFERENT ANGLE (for example: mindset, habits, common mistakes, reframing, practical application, identity).

Each narrative object MUST include the following keys:

* 'theme'

'central_thesis': a concise, opinionated statement that expresses the central idea of that specific narrative angle. It must serve as an entry point to the theme and connect fitness to life improvement.

'main_argument': a medium-length, impactful paragraph. It must challenge a common belief or reinforce a strong truth.

'narrative_sequence': an ordered array describing how the narrative unfolds. Each item MUST be an object containing:

* 'step': number starting at 1
* 'title': short, Instagram-friendly title
* 'description': what should be communicated at that step

Narrative flow guidelines:

Step 1 must capture attention immediately.

Early steps must highlight a common mistake, myth, or recurring pain point.

Middle steps must reframe the theme with a new insight.

At least one step must include practical, actionable guidance.

The final step must deliver a takeaway or an Instagram-appropriate call to action (for example: reflect, save, share, or apply).

All generated text MUST be written in Brazilian Portuguese only.
Do not include any English words, expressions, or sentence structures in the generated content.

────────────────────────────
JSON STRUCTURE EXAMPLE
────────────────────────────
[
  {
    'id': 'random uuid',
    'theme': 'Consistency beats motivation',
    'central_thesis': 'Real progress is built through repetition, not emotional spikes.',
    'main_argument': 'You do not need motivation. You need a system...',
    'narrative_sequence': [
      {
        'step': 1,
        'title': 'The Motivation Myth',
        'description': 'Expose the belief that motivation must come before action.'
      },
      {
        'step': 2,
        'title': 'Why People Get Stuck',
        'description': 'Explain how waiting for the right feeling leads to inaction.'
      },
      {
        'step': 3,
        'title': 'A Better Approach',
        'description': 'Reframe consistency as small actions taken regardless of mood.'
      },
      {
        'step': 4,
        'title': 'Make It Practical',
        'description': 'Share examples of low-effort habits that sustain progress.'
      },
      {
        'step': 5,
        'title': 'The Final Lesson',
        'description': 'Encourage choosing consistency over motivation.'
      }
    ]
  }
]

────────────────────────────
OUTPUT RULES
────────────────────────────

Return ONLY valid JSON.

Use SINGLE QUOTES for all keys and string values.

The root element MUST be a JSON array.

The array MUST contain EXACTLY 5 narrative objects.

Each narrative MUST strictly follow the defined structure.

Do NOT include explanations, markdown, or additional text.

Do NOT include newline characters ('\n') in the output.

`;

export const carouselMasterPrompt = `
    You are a senior content strategist and visual prompt engineer.

    Input:
    Narrative: '{{NARRATIVE}}'
    ==========================

    Your task:
    Generate an Instagram carousel with 7 slides based on the provided narrative.

    The narrative consists of:

    * Central Thesis
    * Main Argument
    * Narrative Sequence

    Color palette: dark tones, black, gray, orange accents
    Visual style: cinematic, realistic, high-contrast lighting

    Rules:

    * Slide 1: image representing the central thesis alongside with the central thesis text
    * Slide 2: image representing the main argument alongside with the main argument text
    * Slides 3 to 7: narrative sequence
    * Each slide must contain:
    * short, impactful text (max. 12 words)
    * an image_prompt that visually represents the message alongside with the narrative sequence text
    * image_prompts must be:
    * cinematic
    * realistic
    * focused on fitness mindset
    * suitable for Instagram
    * visually consistent with each other
    * Do not use emojis
    * All generated text must be in Brazilian Portuguese only
    * Do not include any English words, expressions, or structures in the generated content
    * Return ONLY valid JSON
    * Do not include line breaks
    * Do NOT include explanations, markdown, or additional text
    * Do NOT include newline characters ('\n') in the output

    JSON format:
    {
        "style": {
                "color_palette": "",
                "visual_style": ""
            },
        "slides": [
            {
                "role": "central_thesis | main_argument | sequence",
                "text": "",
                "image_prompt": ""
            }
        ]
    }
`;
