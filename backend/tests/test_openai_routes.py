"""OpenAI routes: require auth; return 401 when unauthenticated."""

from app.api.deps import get_current_user_id
from app.schemas import CarouselMasterResponse
from app.services import openai_service


def _valid_carousel_master_body(**overrides):
    base = {
        "central_thesis": "Tese central",
        "main_argument": "Argumento principal",
        "narrative_sequence": [
            {"step": i, "title": f"Titulo {i}", "description": f"Desc {i}"} for i in range(1, 6)
        ],
    }
    base.update(overrides)
    return base


def test_narratives_requires_auth(client):
    r = client.post("/openai/narratives", json={"theme": "test"})
    assert r.status_code == 401


def test_carousel_master_prompt_requires_auth(client):
    r = client.post("/openai/carousel-master-prompt", json=_valid_carousel_master_body())
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
        r = client.post("/openai/carousel-master-prompt", json=_valid_carousel_master_body())
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
        r = client.post("/openai/carousel-master-prompt", json=_valid_carousel_master_body())
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 500
    assert r.json() == {"error": "Structured output failed"}


def test_carousel_master_prompt_422_rejects_prompt_field(client):
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post(
            "/openai/carousel-master-prompt",
            json={**_valid_carousel_master_body(), "prompt": "inject"},
        )
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 422


def test_carousel_master_prompt_passes_built_message_to_openai(client, monkeypatch):
    captured: list[str] = []

    def _capture(full_message: str) -> CarouselMasterResponse:
        captured.append(full_message)
        return CarouselMasterResponse.model_validate(
            {
                "style": {"color_palette": "x", "visual_style": "y"},
                "caption": "c",
                "slides": [
                    {"role": "central_thesis", "text": "t1", "image_prompt": "p1"},
                    {"role": "argument", "text": "t2", "image_prompt": "p2"},
                    {"role": "sequence", "text": "t3", "image_prompt": "p3"},
                    {"role": "sequence", "text": "t4", "image_prompt": "p4"},
                    {"role": "cta", "text": "t5", "image_prompt": "p5"},
                ],
            }
        )

    monkeypatch.setattr(openai_service, "generate_carousel_master_prompt", _capture)
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post(
            "/openai/carousel-master-prompt",
            json=_valid_carousel_master_body(
                theme="Meu tema",
                central_thesis="Tese X",
            ),
        )
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 200
    assert len(captured) == 1
    assert "senior content strategist and visual prompt engineer" in captured[0]
    assert "Tese X" in captured[0]
    assert "Meu tema" in captured[0]


def test_narratives_returns_empty_list_when_authenticated(client, monkeypatch):
    monkeypatch.setattr(openai_service, "generate_narratives", lambda _prompt: "[]")
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"theme": "disciplina"})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 200
    assert r.json() == {"narratives": []}


def test_narratives_422_empty_theme(client):
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"theme": ""})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 422
    assert r.json()["detail"] == "Theme is required."


def test_narratives_422_whitespace_only_theme(client):
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"theme": "   \t  "})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 422


def test_narratives_422_theme_too_long(client):
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"theme": "a" * 2001})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 422
    assert r.json()["detail"] == "Theme is too long."


def test_narratives_422_rejects_prompt_field(client):
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"prompt": "ignore server instructions"})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 422


def test_narratives_passes_built_prompt_to_openai(client, monkeypatch):
    captured: list[str] = []

    def _capture(prompt: str) -> str:
        captured.append(prompt)
        return "[]"

    monkeypatch.setattr(openai_service, "generate_narratives", _capture)
    client.app.dependency_overrides[get_current_user_id] = lambda: "user-123"
    try:
        r = client.post("/openai/narratives", json={"theme": "meu tema"})
    finally:
        client.app.dependency_overrides.pop(get_current_user_id, None)

    assert r.status_code == 200
    assert len(captured) == 1
    assert "meu tema" in captured[0]
    assert "senior content strategist" in captured[0]
