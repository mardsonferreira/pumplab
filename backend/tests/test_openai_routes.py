"""OpenAI routes: require auth; return 401 when unauthenticated."""


def test_narratives_requires_auth(client):
    r = client.post("/openai/narratives", json={"prompt": "test"})
    assert r.status_code == 401


def test_carousel_master_prompt_requires_auth(client):
    r = client.post("/openai/carousel-master-prompt", json={"prompt": "test"})
    assert r.status_code == 401


def test_carousel_images_requires_auth(client):
    r = client.post("/openai/carousel-images", json={"slides": [{"image_prompt": "a cat"}]})
    assert r.status_code == 401
