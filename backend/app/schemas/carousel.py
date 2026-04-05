"""Pydantic schemas for carousel payloads (master prompt, images, export)."""

from typing import Literal

from pydantic import BaseModel, Field


class CarouselMasterStyle(BaseModel):
    color_palette: str = ""
    visual_style: str = ""


class CarouselMasterSlide(BaseModel):
    role: Literal["central_thesis", "argument", "sequence", "cta"]
    text: str
    image_prompt: str


class CarouselMasterResponse(BaseModel):
    style: CarouselMasterStyle = Field(default_factory=CarouselMasterStyle)
    caption: str = ""
    slides: list[CarouselMasterSlide] = Field(..., min_length=5, max_length=5)


class CarouselImagesSlideInput(BaseModel):
    image_prompt: str
    index: int | None = None
    role: Literal["central_thesis", "argument", "sequence", "cta"] | None = None
    text: str | None = None


class CarouselImagesStyleContext(BaseModel):
    """Optional style from master response to keep image generation consistent."""

    color_palette: str = ""
    visual_style: str = ""


class CarouselImagesRequest(BaseModel):
    slides: list[CarouselImagesSlideInput] = Field(..., min_length=1)
    style: CarouselImagesStyleContext | None = None


class CarouselImagesResponse(BaseModel):
    urls: list[str]


class CarouselExportSlide(BaseModel):
    index: int = Field(..., ge=1, le=5)
    image_url: str = ""
    text: str = ""
    flattened_image_base64: str | None = None


class CarouselExportRequest(BaseModel):
    caption: str
    slides: list[CarouselExportSlide] = Field(..., min_length=5, max_length=5)


class TotalPostsGeneratedResponse(BaseModel):
    posts_generated: int | None = None


class MonthlyNarrativesRemainingResponse(BaseModel):
    monthly_narratives_remaining: int = Field(..., ge=0)


class UpdateTotalPostsGeneratedRequest(BaseModel):
    year: int = Field(..., ge=2000, le=3000)
    month: int = Field(..., ge=1, le=12)
    value: int = Field(..., ge=0)
