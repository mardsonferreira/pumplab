"""Unit tests for server-side narrative template and theme validation."""

import pytest

from app.services.narrative_template import (
    NARRATIVE_THEME_MAX_LENGTH,
    NarrativeThemeValidationError,
    build_narrative_prompt,
)


def test_build_narrative_prompt_includes_theme() -> None:
    out = build_narrative_prompt("  foco no treino  ")
    assert "foco no treino" in out
    assert "Theme: 'foco no treino'" in out
    assert "{{THEME}}" not in out


def test_build_narrative_prompt_rejects_empty() -> None:
    with pytest.raises(NarrativeThemeValidationError):
        build_narrative_prompt("")
    with pytest.raises(NarrativeThemeValidationError):
        build_narrative_prompt("   ")


def test_build_narrative_prompt_rejects_too_long() -> None:
    long_theme = "a" * (NARRATIVE_THEME_MAX_LENGTH + 1)
    with pytest.raises(NarrativeThemeValidationError):
        build_narrative_prompt(long_theme)


def test_build_narrative_prompt_accepts_max_length() -> None:
    theme = "a" * NARRATIVE_THEME_MAX_LENGTH
    out = build_narrative_prompt(theme)
    assert theme in out
