from types import SimpleNamespace

import pytest

from app.schemas import CarouselMasterResponse
from app.services import openai_service


def _carousel_payload() -> dict:
    return {
        "style": {
            "color_palette": "dark tones, orange accents",
            "visual_style": "cinematic, high-contrast",
        },
        "caption": "Progresso real vem da pratica constante.",
        "slides": [
            {"role": "central_thesis", "text": "Disciplina diaria cria resultados.", "image_prompt": "Scene 1"},
            {"role": "argument", "text": "Sistema vence motivacao.", "image_prompt": "Scene 2"},
            {"role": "sequence", "text": "Passo 1", "image_prompt": "Scene 3"},
            {"role": "sequence", "text": "Passo 2", "image_prompt": "Scene 4"},
            {"role": "cta", "text": "Salve e aplique.", "image_prompt": "Scene 5"},
        ],
    }


def test_generate_carousel_master_prompt_returns_parsed_model(monkeypatch):
    expected = CarouselMasterResponse.model_validate(_carousel_payload())

    class FakeCompletions:
        def parse(self, **kwargs):
            assert kwargs["response_format"] is CarouselMasterResponse
            return SimpleNamespace(
                choices=[
                    SimpleNamespace(
                        message=SimpleNamespace(parsed=expected, refusal=None),
                    )
                ]
            )

    fake_client = SimpleNamespace(
        beta=SimpleNamespace(
            chat=SimpleNamespace(completions=FakeCompletions()),
        )
    )
    monkeypatch.setattr(openai_service, "_client", lambda: fake_client)
    monkeypatch.setattr(
        openai_service,
        "get_settings",
        lambda: SimpleNamespace(USE_MOCK_LLM=False),
    )

    parsed = openai_service.generate_carousel_master_prompt("test prompt")

    assert parsed == expected


def test_generate_carousel_master_prompt_raises_on_refusal(monkeypatch):
    class FakeCompletions:
        def parse(self, **kwargs):
            return SimpleNamespace(
                choices=[
                    SimpleNamespace(
                        message=SimpleNamespace(parsed=None, refusal="I cannot comply"),
                    )
                ]
            )

    fake_client = SimpleNamespace(
        beta=SimpleNamespace(
            chat=SimpleNamespace(completions=FakeCompletions()),
        )
    )
    monkeypatch.setattr(openai_service, "_client", lambda: fake_client)
    monkeypatch.setattr(
        openai_service,
        "get_settings",
        lambda: SimpleNamespace(USE_MOCK_LLM=False),
    )

    with pytest.raises(ValueError, match="refused"):
        openai_service.generate_carousel_master_prompt("test prompt")


def test_generate_carousel_master_prompt_mock_mode_returns_valid_model(monkeypatch):
    monkeypatch.setattr(
        openai_service,
        "get_settings",
        lambda: SimpleNamespace(USE_MOCK_LLM=True),
    )

    parsed = openai_service.generate_carousel_master_prompt("test prompt")

    assert isinstance(parsed, CarouselMasterResponse)
    assert len(parsed.slides) == 5


def test_generate_carousel_images_combines_style_role_text_and_scene(monkeypatch):
    captured: dict[str, str] = {}

    class FakeImages:
        def generate(self, **kwargs):
            captured["prompt"] = kwargs["prompt"]
            return SimpleNamespace(data=[SimpleNamespace(url="https://example.com/slide.png")])

    fake_client = SimpleNamespace(images=FakeImages())
    monkeypatch.setattr(openai_service, "_client", lambda: fake_client)
    monkeypatch.setattr(
        openai_service,
        "get_settings",
        lambda: SimpleNamespace(USE_MOCK_LLM=False),
    )

    urls = openai_service.generate_carousel_images(
        slides=[
            {
                "image_prompt": "Pessoa treinando ao amanhecer",
                "role": "central_thesis",
                "text": "Disciplina diaria cria resultados.",
            }
        ],
        style={"color_palette": "dark tones, orange accents", "visual_style": "cinematic"},
    )

    assert urls == ["https://example.com/slide.png"]
    prompt = captured["prompt"]
    assert "Visual style (apply to entire image): dark tones, orange accents, cinematic." in prompt
    assert "Narrative role for this slide: central_thesis." in prompt
    assert "CRITICAL: Do NOT include any text" in prompt
    assert "Scene: Pessoa treinando ao amanhecer" in prompt
