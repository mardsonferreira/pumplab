export const MAX_OVERLAYS_PER_SLIDE = 10;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_LINE_HEIGHT = 1.3;
export const DEFAULT_TEXT_COLOR = "#FFFFFF";

export const SLIDE_WIDTH = 1024;
export const SLIDE_HEIGHT = 1024;

export const DEFAULT_TEXT_WIDTH = 300;
export const DEFAULT_TEXT_HEIGHT = 80;

/** Smallest box users can resize a text overlay to (logical slide pixels). */
export const MIN_OVERLAY_WIDTH = 48;
export const MIN_OVERLAY_HEIGHT = 32;

/**
 * Clamp overlay rectangle inside the slide and enforce minimum size.
 * Width/height are capped to the container so position can always be clamped afterward.
 */
export function clampOverlayRect(
    x: number,
    y: number,
    w: number,
    h: number,
    containerW: number,
    containerH: number,
    minW = MIN_OVERLAY_WIDTH,
    minH = MIN_OVERLAY_HEIGHT,
): { x: number; y: number; width: number; height: number } {
    const width = Math.max(minW, Math.min(w, containerW));
    const height = Math.max(minH, Math.min(h, containerH));
    return {
        x: Math.max(0, Math.min(x, containerW - width)),
        y: Math.max(0, Math.min(y, containerH - height)),
        width,
        height,
    };
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
