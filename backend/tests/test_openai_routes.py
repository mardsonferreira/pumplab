"""OpenAI routes: require auth; return 401 when unauthenticated."""

from app.api.deps import get_current_user_id
from app.schemas import CarouselMasterResponse
from app.services import openai_service


def test_narratives_requires_auth(client):
    r = client.post("/openai/narratives", json={"prompt": "test"})
    assert r.status_code == 401


def test_carousel_master_prompt_requires_auth(client):
    r = client.post("/openai/carousel-master-prompt", json={"prompt": "test"})
    assert r.status_code == 401


def test_carousel_images_requires_auth(client):
    r = client.post("/openai/carousel-images", json={"slides": [{"image_prompt": "a cat"}]})
    assert r.status_code == 401


def test_carousel_export_requires_auth(client):
    r = client.post(
        "/openai/carousel-export",
        json={
            "caption": "Test",
            "slides": [
                {"index": i, "image_url": "https://example.com/s.png", "text": "x"}
                for i in range(1, 6)
            ],
        },
    )
    assert r.status_code == 401


def test_carousel_master_prompt_returns_structured_payload_when_authenticated(
    client,
    monkeypatch,
):
    expected = CarouselMasterResponse.model_validate(
        {
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
    )

    monkeypatch.setattr(openai_service, "generate_carousel_master_prompt", lambda _prompt: expected)
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/carousel-master-prompt", json={"prompt": "test"})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 200
    data = r.json()
    assert data["style"]["color_palette"] == "dark tones, orange accents"
    assert data["style"]["visual_style"] == "cinematic, high-contrast"
    assert len(data["slides"]) == 5
    assert set(data["slides"][0].keys()) == {"role", "text", "image_prompt"}


def test_carousel_master_prompt_returns_500_on_service_value_error(
    client,
    monkeypatch,
):
    def _raise_error(_prompt: str):
        raise ValueError("Structured output failed")

    monkeypatch.setattr(openai_service, "generate_carousel_master_prompt", _raise_error)
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/carousel-master-prompt", json={"prompt": "test"})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 500
    assert r.json() == {"error": "Structured output failed"}
