import base64
import io
import zipfile
from datetime import datetime, timezone
from urllib.request import urlopen

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, ConfigDict

from app.api.deps import get_current_user_id
from app.schemas import (
    CarouselExportRequest,
    CarouselImagesRequest,
    CarouselImagesResponse,
    CarouselMasterNarrativeBody,
    CarouselMasterResponse,
)
from app.services import openai_service
from app.services.carousel_master_template import build_carousel_master_user_message
from app.services.narrative_template import NarrativeThemeValidationError, build_narrative_prompt

router = APIRouter()


class NarrativesThemeBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    theme: str


@router.post("/narratives")
def post_narratives(body: NarrativesThemeBody, user_id: str = Depends(get_current_user_id)):
    try:
        full = build_narrative_prompt(body.theme)
    except NarrativeThemeValidationError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    try:
        raw = openai_service.generate_narratives(full)
        narratives = openai_service.parse_narrative_content(raw)
        return JSONResponse(content={"narratives": narratives})
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})


@router.post("/carousel-master-prompt", response_model=CarouselMasterResponse)
def post_carousel_master_prompt(
    body: CarouselMasterNarrativeBody, user_id: str = Depends(get_current_user_id)
):
    try:
        full = build_carousel_master_user_message(body)
        return openai_service.generate_carousel_master_prompt(full)
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})


@router.post("/carousel-images", response_model=CarouselImagesResponse)
def post_carousel_images(
    body: CarouselImagesRequest, user_id: str = Depends(get_current_user_id)
):
    try:
        slides_dict = [s.model_dump() for s in body.slides]
        style_dict = body.style.model_dump() if body.style else None
        urls = openai_service.generate_carousel_images(slides_dict, style=style_dict)
        return CarouselImagesResponse(urls=urls)
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})


def _fetch_image_bytes(url: str) -> bytes:
    with urlopen(url, timeout=30) as resp:
        return resp.read()


@router.post("/carousel-export")
def post_carousel_export(
    body: CarouselExportRequest, user_id: str = Depends(get_current_user_id)
):
    try:
        slides_sorted = sorted(body.slides, key=lambda s: s.index)
        if len(slides_sorted) != 5:
            return JSONResponse(
                status_code=400,
                content={"error": "Exactly 5 slides with valid image_url are required"},
            )
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for i, slide in enumerate(slides_sorted, start=1):
                # Flattened base64 takes precedence (WYSIWYG export with overlays)
                if slide.flattened_image_base64 and slide.flattened_image_base64.strip():
                    try:
                        raw = base64.b64decode(slide.flattened_image_base64)
                    except Exception:
                        return JSONResponse(
                            status_code=400,
                            content={"error": f"Slide {i} has invalid flattened_image_base64"},
                        )
                elif slide.image_url and slide.image_url.strip():
                    try:
                        raw = _fetch_image_bytes(slide.image_url)
                    except Exception as e:
                        return JSONResponse(
                            status_code=502,
                            content={
                                "error": "Failed to fetch one or more images; try again or regenerate the slide.",
                                "detail": str(e),
                            },
                        )
                else:
                    return JSONResponse(
                        status_code=400,
                        content={"error": f"Slide {i} has no image_url or flattened_image_base64"},
                    )
                zf.writestr(f"post/slide_{i:02d}.png", raw)
            zf.writestr(
                "post/caption.txt",
                (body.caption or "").encode("utf-8"),
            )
        buf.seek(0)
        filename = f"instagram_post_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.zip"
        return Response(
            content=buf.getvalue(),
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "Export failed", "detail": str(e)},
        )
