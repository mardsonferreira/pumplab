"""Carousel partial retry and export ZIP: service and route behavior."""

import base64
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


def test_carousel_export_flattened_base64_takes_precedence():
    """When flattened_image_base64 is present, it takes precedence over image_url."""
    flattened_png = b"\x89PNG_FLAT"
    flattened_b64 = base64.b64encode(flattened_png).decode()
    url_png = b"\x89PNG_URL"

    body = {
        "caption": "Flattened test.",
        "slides": [
            {
                "index": i,
                "image_url": f"https://example.com/s{i}.png",
                "text": f"Slide {i}",
                "flattened_image_base64": flattened_b64,
            }
            for i in range(1, 6)
        ],
    }

    app.dependency_overrides[get_current_user_id] = lambda: "test-user-id"
    try:
        with patch("app.api.routes.openai._fetch_image_bytes", side_effect=lambda u: url_png):
            client = TestClient(app)
            r = client.post("/openai/carousel-export", json=body)
            assert r.status_code == 200
            buf = io.BytesIO(r.content)
            with zipfile.ZipFile(buf, "r") as zf:
                # All slides should contain flattened data, not the URL-fetched data
                for i in range(1, 6):
                    content = zf.read(f"post/slide_{i:02d}.png")
                    assert content == flattened_png
    finally:
        app.dependency_overrides.pop(get_current_user_id, None)


def test_carousel_export_mixed_flattened_and_url():
    """Slides with flattened data use base64; others fall back to image_url fetch."""
    flattened_png = b"\x89PNG_FLAT"
    flattened_b64 = base64.b64encode(flattened_png).decode()
    url_png = b"\x89PNG_URL"

    slides = []
    for i in range(1, 6):
        slide = {"index": i, "image_url": f"https://example.com/s{i}.png", "text": f"S{i}"}
        if i <= 2:
            slide["flattened_image_base64"] = flattened_b64
        slides.append(slide)

    body = {"caption": "Mixed test.", "slides": slides}

    app.dependency_overrides[get_current_user_id] = lambda: "test-user-id"
    try:
        with patch("app.api.routes.openai._fetch_image_bytes", side_effect=lambda u: url_png):
            client = TestClient(app)
            r = client.post("/openai/carousel-export", json=body)
            assert r.status_code == 200
            buf = io.BytesIO(r.content)
            with zipfile.ZipFile(buf, "r") as zf:
                assert zf.read("post/slide_01.png") == flattened_png
                assert zf.read("post/slide_02.png") == flattened_png
                assert zf.read("post/slide_03.png") == url_png
                assert zf.read("post/slide_04.png") == url_png
                assert zf.read("post/slide_05.png") == url_png
    finally:
        app.dependency_overrides.pop(get_current_user_id, None)


def test_carousel_export_invalid_base64_returns_400():
    """Invalid base64 in flattened_image_base64 should return 400."""
    body = {
        "caption": "Bad base64.",
        "slides": [
            {
                "index": i,
                "image_url": f"https://example.com/s{i}.png",
                "text": f"S{i}",
                "flattened_image_base64": "!!!not-valid-base64!!!" if i == 1 else None,
            }
            for i in range(1, 6)
        ],
    }

    app.dependency_overrides[get_current_user_id] = lambda: "test-user-id"
    try:
        with patch("app.api.routes.openai._fetch_image_bytes", side_effect=lambda u: b"\x89PNG"):
            client = TestClient(app)
            r = client.post("/openai/carousel-export", json=body)
            assert r.status_code == 400
            assert "invalid" in r.json()["error"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user_id, None)
