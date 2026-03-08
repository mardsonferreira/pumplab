"""Carousel partial retry and export ZIP: service and route behavior."""

import io
import zipfile
from unittest.mock import patch

from app.api.deps import get_current_user_id
from app.main import app
from app.services import openai_service
from fastapi.testclient import TestClient


def test_carousel_images_partial_retry_returns_one_url_per_requested_slide():
    """Partial retry: only failed slides are sent; backend returns one URL per slide (mock)."""
    with patch("app.services.openai_service.get_settings") as m:
        m.return_value.USE_MOCK_LLM = True
        slides = [
            {"image_prompt": "first failed slide"},
            {"image_prompt": "second failed slide"},
        ]
        urls = openai_service.generate_carousel_images(slides)
        assert len(urls) == 2
        assert all(isinstance(u, str) for u in urls)
        assert urls[0] and urls[1]


def test_carousel_export_zip_structure():
    """Export returns ZIP with post/slide_01.png .. post/slide_05.png and post/caption.txt."""
    fake_png = b"\x89PNG\r\n\x1a\n"
    body = {
        "caption": "Test caption.",
        "slides": [
            {"index": i, "image_url": f"https://example.com/s{i}.png", "text": f"Slide {i}"}
            for i in range(1, 6)
        ],
    }

    def fake_urlopen(url, timeout=None):
        return io.BytesIO(fake_png)

    app.dependency_overrides[get_current_user_id] = lambda: "test-user-id"
    try:
        with patch("app.api.routes.openai._fetch_image_bytes", side_effect=lambda u: fake_png):
            client = TestClient(app)
            r = client.post("/openai/carousel-export", json=body)
            assert r.status_code == 200
            assert "application/zip" in r.headers.get("content-type", "")
            buf = io.BytesIO(r.content)
            with zipfile.ZipFile(buf, "r") as zf:
                names = sorted(zf.namelist())
                assert names == [
                    "post/caption.txt",
                    "post/slide_01.png",
                    "post/slide_02.png",
                    "post/slide_03.png",
                    "post/slide_04.png",
                    "post/slide_05.png",
                ]
                assert zf.read("post/caption.txt").decode("utf-8") == "Test caption."
                for name in names:
                    if name.endswith(".png"):
                        assert zf.read(name) == fake_png
    finally:
        app.dependency_overrides.pop(get_current_user_id, None)
