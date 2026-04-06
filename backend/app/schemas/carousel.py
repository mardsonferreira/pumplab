"""Pydantic schemas for carousel payloads (master prompt, images, export)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


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


class NarrativeSequenceStepInput(BaseModel):
    """One step in the editable narrative (matches frontend narrative sequence shape)."""

    model_config = ConfigDict(extra="forbid")

    step: int = Field(..., ge=1, le=5)
    title: str = Field(..., max_length=500)
    description: str = Field(..., max_length=4000)

    @field_validator("title", "description", mode="before")
    @classmethod
    def strip_required_strings(cls, v: object) -> object:
        if isinstance(v, str):
            s = v.strip()
            if not s:
                raise ValueError("must not be empty")
            return s
        return v


class CarouselMasterNarrativeBody(BaseModel):
    """Structured narrative for server-side carousel master prompt (no client-supplied prompt string)."""

    model_config = ConfigDict(extra="forbid")

    theme: str | None = None
    central_thesis: str = Field(..., max_length=8000)
    main_argument: str = Field(..., max_length=12000)
    narrative_sequence: list[NarrativeSequenceStepInput] = Field(..., min_length=5, max_length=5)

    @field_validator("theme", mode="before")
    @classmethod
    def normalize_theme(cls, v: object) -> str | None:
        if v is None:
            return None
        if isinstance(v, str):
            s = v.strip()
            if not s:
                return None
            return s
        return v

    @field_validator("theme")
    @classmethod
    def theme_max_len(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 2000:
            raise ValueError("Theme is too long.")
        return v

    @field_validator("central_thesis", "main_argument", mode="before")
    @classmethod
    def strip_required_narrative_fields(cls, v: object) -> object:
        if isinstance(v, str):
            s = v.strip()
            if not s:
                raise ValueError("must not be empty")
            return s
        return v

    @model_validator(mode="after")
    def narrative_steps_are_one_through_five(self) -> CarouselMasterNarrativeBody:
        seq = self.narrative_sequence
        steps_sorted = sorted(s.step for s in seq)
        if steps_sorted != [1, 2, 3, 4, 5]:
            raise ValueError("narrative_sequence must contain steps 1 through 5 exactly once")
        return self


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
