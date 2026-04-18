export const MAX_OVERLAYS_PER_SLIDE = 10;
export const MIN_FONT_SIZE = 10;
/** Upper bound for the toolbar and overlay text (logical slide pixels). */
export const MAX_FONT_SIZE = 96;
export const DEFAULT_FONT_SIZE = 24;
/** Default font for new overlays on narrow viewports (typical phones). Logical slide pixels. */
export const DEFAULT_FONT_SIZE_SMALL_SCREEN = 78;

/** Viewport width at or below this uses `DEFAULT_FONT_SIZE_SMALL_SCREEN` for new overlays (Tailwind `sm` breakpoint). */
export const SMALL_SCREEN_MAX_WIDTH_PX = 640;

/**
 * Font size for newly created overlays: larger on small screens so text stays readable when scaled down.
 * Uses `DEFAULT_FONT_SIZE` when `window` is unavailable (SSR/tests).
 */
export function defaultFontSizeForViewport(): number {
    if (typeof window === "undefined") return DEFAULT_FONT_SIZE;
    return window.matchMedia(`(max-width: ${SMALL_SCREEN_MAX_WIDTH_PX}px)`).matches
        ? DEFAULT_FONT_SIZE_SMALL_SCREEN
        : DEFAULT_FONT_SIZE;
}
export const DEFAULT_LINE_HEIGHT = 1.3;
export const DEFAULT_TEXT_COLOR = "#FFFFFF";
/**
 * Instagram-like sans stack for overlays:
 * prefers modern native fonts and falls back to common web-safe sans-serif fonts.
 */
export const OVERLAY_TEXT_FONT_FAMILY =
    '"Helvetica Neue", "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const SLIDE_WIDTH = 1024;
export const SLIDE_HEIGHT = 1024;

/** New text overlays span the slide; positioned at the bottom in `createTextOverlay`. */
export const DEFAULT_TEXT_WIDTH = SLIDE_WIDTH;
/** Default strip height for bottom-aligned text (logical slide pixels). */
export const DEFAULT_TEXT_HEIGHT = 220;

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
