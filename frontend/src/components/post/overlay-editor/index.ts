export { OverlayCanvas } from "./overlay-canvas";
export type { OverlayCanvasProps } from "./overlay-canvas/types";

export { flattenSlide } from "./export/flatten-slide";

export { overlayReducer, type OverlayAction } from "./state";

export { createTextOverlay } from "./factories";

export { computeTextFit } from "./text-fit";

export { canAddOverlay, defaultFontSizeForViewport, SLIDE_WIDTH, SLIDE_HEIGHT } from "./constants";

export type { TextUpdatePatch } from "./types";
