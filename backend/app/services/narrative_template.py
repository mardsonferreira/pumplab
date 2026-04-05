"""Server-side narrative generation template. User input is only substituted at {{THEME}}."""

from __future__ import annotations

NARRATIVE_THEME_MAX_LENGTH = 2000


class NarrativeThemeValidationError(ValueError):
    """Raised when theme fails trim/length validation before building the LLM prompt."""


# Parity with former frontend `narrativePrompt` (frontend/src/app/hooks/prompt.ts).
NARRATIVE_TEMPLATE = """
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

'narrative_sequence': an ordered array describing how the narrative unfolds. Each narrative_sequence MUST contain EXACTLY 5 steps. Each item MUST be an object containing:

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
    "id": "random uuid",
    "theme": "Consistency beats motivation",
    "central_thesis": "Real progress is built through repetition, not emotional spikes.",
    "main_argument": "You do not need motivation. You need a system...",
    "narrative_sequence": [
      {
        "step": 1,
        "title": "The Motivation Myth",
        "description": "Expose the belief that motivation must come before action."
      },
      {
        "step": 2,
        "title": "Why People Get Stuck",
        "description": "Explain how waiting for the right feeling leads to inaction."
      },
      {
        "step": 3,
        "title": "A Better Approach",
        "description": "Reframe consistency as small actions taken regardless of mood."
      },
      {
        "step": 4,
        "title": "Make It Practical",
        "description": "Share examples of low-effort habits that sustain progress."
      },
      {
        "step": 5,
        "title": "The Final Lesson",
        "description": "Encourage choosing consistency over motivation."
      }
    ]
  }
]

────────────────────────────
OUTPUT RULES
────────────────────────────

Return ONLY valid JSON.

Use DOUBLE QUOTES for all keys and string values.

The root element MUST be a JSON array.

The array MUST contain EXACTLY 5 narrative objects.

Each narrative MUST strictly follow the defined structure.

Do NOT include explanations, markdown, or additional text.

Do NOT include newline characters ('\\n') in the output.

"""


def build_narrative_prompt(theme: str) -> str:
    """Build the full user message for narrative generation. Validates theme length and non-empty after strip."""
    t = (theme or "").strip()
    if not t:
        raise NarrativeThemeValidationError("Theme is required.")
    if len(t) > NARRATIVE_THEME_MAX_LENGTH:
        raise NarrativeThemeValidationError("Theme is too long.")
    return NARRATIVE_TEMPLATE.replace("{{THEME}}", t)
