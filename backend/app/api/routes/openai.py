from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.api.deps import get_current_user_id
from app.services import openai_service

router = APIRouter()


class PromptBody(BaseModel):
    prompt: str


class CarouselImagesBody(BaseModel):
    slides: list[dict]


@router.post("/narratives")
def post_narratives(body: PromptBody, user_id: str = Depends(get_current_user_id)):
    try:
        raw = openai_service.generate_narratives(body.prompt)
        narratives = openai_service.parse_narrative_content(raw)
        return JSONResponse(content={"narratives": narratives})
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})


@router.post("/carousel-master-prompt")
def post_carousel_master_prompt(body: PromptBody, user_id: str = Depends(get_current_user_id)):
    try:
        content = openai_service.generate_carousel_master_prompt(body.prompt)
        return JSONResponse(content={"content": content})
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})


@router.post("/carousel-images")
def post_carousel_images(body: CarouselImagesBody, user_id: str = Depends(get_current_user_id)):
    try:
        urls = openai_service.generate_carousel_images(body.slides)
        return JSONResponse(content={"urls": urls})
    except ValueError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "OpenAI request failed"})
