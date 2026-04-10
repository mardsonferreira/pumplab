import type { OverflowStatus } from "@/types";
import { MIN_FONT_SIZE, OVERLAY_TEXT_FONT_FAMILY } from "./constants";

export interface TextFitResult {
    fontSize: number;
    overflow: OverflowStatus;
}

/**
 * Determines the best font size for text inside a box of given dimensions.
 *
 * Strategy:
 * 1. Start at the requested font size.
 * 2. If text overflows, reduce by 1px steps until MIN_FONT_SIZE.
 * 3. If still overflowing at MIN_FONT_SIZE, keep full text and flag overflow: "warning".
 *
 * Uses an off-screen canvas context for measurement to avoid DOM reflows.
 */
export function computeTextFit(
    text: string,
    requestedFontSize: number,
    boxWidth: number,
    boxHeight: number,
    lineHeight: number,
    fontFamily = OVERLAY_TEXT_FONT_FAMILY,
): TextFitResult {
    if (typeof document === "undefined") {
        return { fontSize: requestedFontSize, overflow: "none" };
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { fontSize: requestedFontSize, overflow: "none" };

    for (let size = requestedFontSize; size >= MIN_FONT_SIZE; size--) {
        if (fitsInBox(ctx, text, size, boxWidth, boxHeight, lineHeight, fontFamily)) {
            return { fontSize: size, overflow: "none" };
        }
    }
    return { fontSize: MIN_FONT_SIZE, overflow: "warning" };
}

function fitsInBox(
    ctx: CanvasRenderingContext2D,
    text: string,
    fontSize: number,
    boxW: number,
    boxH: number,
    lineHeight: number,
    fontFamily: string,
): boolean {
    ctx.font = `${fontSize}px ${fontFamily}`;
    const lines = wrapText(ctx, text, boxW);
    const totalHeight = lines.length * fontSize * lineHeight;
    return totalHeight <= boxH;
}

/** Word-wrap text to fit within maxWidth using canvas measurement. */
export function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
): string[] {
    const paragraphs = text.split("\n");
    const result: string[] = [];

    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            result.push("");
            continue;
        }
        let currentLine = words[0];
        for (let i = 1; i < words.length; i++) {
            const test = `${currentLine} ${words[i]}`;
            if (ctx.measureText(test).width <= maxWidth) {
                currentLine = test;
            } else {
                result.push(currentLine);
                currentLine = words[i];
            }
        }
        result.push(currentLine);
    }
    return result;
}
