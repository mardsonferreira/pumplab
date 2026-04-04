import type { OverlayElement, TextOverlay, ShapeOverlay } from "@/types";

export const MAX_OVERLAYS_PER_SLIDE = 10;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_LINE_HEIGHT = 1.3;
export const DEFAULT_TEXT_COLOR = "#FFFFFF";
export const DEFAULT_SHAPE_COLOR = "#000000";
export const DEFAULT_SHAPE_OPACITY = 0.5;

export const SLIDE_WIDTH = 1024;
export const SLIDE_HEIGHT = 1024;

export const DEFAULT_TEXT_WIDTH = 300;
export const DEFAULT_TEXT_HEIGHT = 80;
export const DEFAULT_SHAPE_WIDTH = 200;
export const DEFAULT_SHAPE_HEIGHT = 200;

export function isTextOverlay(el: OverlayElement): el is TextOverlay {
    return el.kind === "text";
}

export function isShapeOverlay(el: OverlayElement): el is ShapeOverlay {
    return el.kind === "shape";
}

/** Clamp position so the element stays fully inside the slide bounds. */
export function clampBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    containerW = SLIDE_WIDTH,
    containerH = SLIDE_HEIGHT,
): { x: number; y: number } {
    return {
        x: Math.max(0, Math.min(x, containerW - width)),
        y: Math.max(0, Math.min(y, containerH - height)),
    };
}

export function canAddOverlay(currentCount: number): boolean {
    return currentCount < MAX_OVERLAYS_PER_SLIDE;
}
