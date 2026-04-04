import type { TextOverlay, ShapeOverlay, ShapeType } from "@/types";
import {
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_TEXT_COLOR,
    DEFAULT_TEXT_WIDTH,
    DEFAULT_TEXT_HEIGHT,
    DEFAULT_SHAPE_COLOR,
    DEFAULT_SHAPE_OPACITY,
    DEFAULT_SHAPE_WIDTH,
    DEFAULT_SHAPE_HEIGHT,
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
} from "./constants";

let idCounter = 0;
function nextId(prefix: string): string {
    idCounter += 1;
    return `${prefix}_${Date.now()}_${idCounter}`;
}

export function createTextOverlay(
    text: string,
    /** Highest zIndex among current overlays so new text sits on top. */
    maxZ: number,
    opts?: Partial<Pick<TextOverlay, "x" | "y" | "width" | "height" | "fontSize" | "color">>,
): TextOverlay {
    const width = opts?.width ?? DEFAULT_TEXT_WIDTH;
    const height = opts?.height ?? DEFAULT_TEXT_HEIGHT;
    return {
        id: nextId("txt"),
        kind: "text",
        x: opts?.x ?? Math.round((SLIDE_WIDTH - width) / 2),
        y: opts?.y ?? Math.round((SLIDE_HEIGHT - height) / 2),
        width,
        height,
        zIndex: maxZ + 1,
        text,
        fontSize: opts?.fontSize ?? DEFAULT_FONT_SIZE,
        color: opts?.color ?? DEFAULT_TEXT_COLOR,
        lineHeight: DEFAULT_LINE_HEIGHT,
        overflow: "none",
    };
}

export function createShapeOverlay(
    shapeType: ShapeType,
    /** Lowest zIndex among current overlays so shapes start behind text. */
    minZ: number,
    opts?: Partial<Pick<ShapeOverlay, "x" | "y" | "width" | "height" | "color" | "opacity">>,
): ShapeOverlay {
    const width = opts?.width ?? DEFAULT_SHAPE_WIDTH;
    const height = opts?.height ?? DEFAULT_SHAPE_HEIGHT;
    return {
        id: nextId("shp"),
        kind: "shape",
        x: opts?.x ?? Math.round((SLIDE_WIDTH - width) / 2),
        y: opts?.y ?? Math.round((SLIDE_HEIGHT - height) / 2),
        width,
        height,
        zIndex: minZ - 1,
        shapeType,
        color: opts?.color ?? DEFAULT_SHAPE_COLOR,
        filled: true,
        opacity: opts?.opacity ?? DEFAULT_SHAPE_OPACITY,
    };
}
