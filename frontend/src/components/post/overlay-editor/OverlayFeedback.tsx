"use client";

import React from "react";
import type { OverlayElement, TextOverlay } from "@/types";
import { isTextOverlay, MAX_OVERLAYS_PER_SLIDE } from "./constants";

interface OverlayFeedbackProps {
    overlays: OverlayElement[];
    selected: OverlayElement | null;
}

/**
 * Rough luminance check: returns true if the color is likely light/hard to read
 * against a typical dark background image.
 */
function isLowContrast(color: string): boolean {
    const hex = color.replace("#", "");
    if (hex.length < 6) return false;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Colors with luminance in 0.35-0.65 range may have contrast issues
    return luminance > 0.35 && luminance < 0.65;
}

export function OverlayFeedback({ overlays, selected }: OverlayFeedbackProps) {
    const warnings: string[] = [];
    const hints: string[] = [];

    if (overlays.length >= MAX_OVERLAYS_PER_SLIDE) {
        warnings.push(`Limite de ${MAX_OVERLAYS_PER_SLIDE} elementos atingido neste slide.`);
    }

    if (selected && isTextOverlay(selected)) {
        const textEl = selected as TextOverlay;
        if (textEl.overflow === "warning") {
            warnings.push("O texto não cabe na caixa. Reduza o texto ou aumente o tamanho da caixa.");
        }
        if (isLowContrast(textEl.color)) {
            hints.push("A cor do texto pode ter baixo contraste com a imagem de fundo.");
        }
    }

    if (selected) {
        hints.push("Arraste para mover. Use os controles abaixo para editar.");
    }

    if (warnings.length === 0 && hints.length === 0) return null;

    return (
        <div className="flex flex-col gap-1 px-1">
            {warnings.map((w, i) => (
                <p key={`w-${i}`} className="text-xs text-amber-500">
                    ⚠ {w}
                </p>
            ))}
            {hints.map((h, i) => (
                <p key={`h-${i}`} className="text-xs text-muted-foreground">
                    💡 {h}
                </p>
            ))}
        </div>
    );
}
