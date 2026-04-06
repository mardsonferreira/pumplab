"""Unit tests for carousel master template builder."""

from app.schemas.carousel import CarouselMasterNarrativeBody, NarrativeSequenceStepInput
from app.services.carousel_master_template import build_carousel_master_user_message


def _body(theme: str | None = "Tema") -> CarouselMasterNarrativeBody:
    steps = [
        NarrativeSequenceStepInput(step=i, title=f"T{i}", description=f"D{i}") for i in range(1, 6)
    ]
    return CarouselMasterNarrativeBody(
        theme=theme,
        central_thesis="Central",
        main_argument="Argument",
        narrative_sequence=steps,
    )


def test_build_carousel_master_user_message_includes_json_and_template() -> None:
    out = build_carousel_master_user_message(_body())
    assert "senior content strategist and visual prompt engineer" in out
    assert '"central_thesis": "Central"' in out
    assert '"theme": "Tema"' in out
    assert "{{NARRATIVE}}" not in out


def test_build_carousel_master_user_message_omits_empty_theme() -> None:
    out = build_carousel_master_user_message(_body(theme=None))
    assert '"theme":' not in out
    assert '"central_thesis": "Central"' in out
