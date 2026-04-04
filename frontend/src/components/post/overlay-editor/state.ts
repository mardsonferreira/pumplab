import type { OverlayElement, TextOverlay, ShapeOverlay } from "@/types";
import { clampBounds, MAX_OVERLAYS_PER_SLIDE } from "./constants";

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type OverlayAction =
    | { type: "ADD_OVERLAY"; overlay: OverlayElement }
    | { type: "DELETE_OVERLAY"; id: string }
    | { type: "UPDATE_TEXT"; id: string; patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color" | "overflow">> }
    | { type: "UPDATE_SHAPE"; id: string; patch: Partial<Pick<ShapeOverlay, "shapeType" | "color" | "filled" | "opacity">> }
    | { type: "MOVE"; id: string; x: number; y: number; containerW: number; containerH: number }
    | { type: "RESIZE"; id: string; width: number; height: number }
    | { type: "BRING_FORWARD"; id: string }
    | { type: "SEND_BACKWARD"; id: string }
    | { type: "SET_OVERLAYS"; overlays: OverlayElement[] };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function overlayReducer(
    overlays: OverlayElement[],
    action: OverlayAction,
): OverlayElement[] {
    switch (action.type) {
        case "ADD_OVERLAY": {
            if (overlays.length >= MAX_OVERLAYS_PER_SLIDE) return overlays;
            return [...overlays, action.overlay];
        }

        case "DELETE_OVERLAY":
            return overlays.filter(o => o.id !== action.id);

        case "UPDATE_TEXT":
            return overlays.map(o =>
                o.id === action.id && o.kind === "text"
                    ? { ...o, ...action.patch }
                    : o,
            );

        case "UPDATE_SHAPE":
            return overlays.map(o =>
                o.id === action.id && o.kind === "shape"
                    ? { ...o, ...action.patch }
                    : o,
            );

        case "MOVE":
            return overlays.map(o => {
                if (o.id !== action.id) return o;
                const clamped = clampBounds(
                    action.x, action.y, o.width, o.height,
                    action.containerW, action.containerH,
                );
                return { ...o, x: clamped.x, y: clamped.y };
            });

        case "RESIZE":
            return overlays.map(o => {
                if (o.id !== action.id) return o;
                const w = Math.max(20, action.width);
                const h = Math.max(20, action.height);
                return { ...o, width: w, height: h };
            });

        case "BRING_FORWARD": {
            const sorted = [...overlays].sort((a, b) => a.zIndex - b.zIndex);
            const idx = sorted.findIndex(o => o.id === action.id);
            if (idx < 0 || idx === sorted.length - 1) return overlays;
            const target = sorted[idx];
            const above = sorted[idx + 1];
            return overlays.map(o => {
                if (o.id === target.id) return { ...o, zIndex: above.zIndex };
                if (o.id === above.id) return { ...o, zIndex: target.zIndex };
                return o;
            });
        }

        case "SEND_BACKWARD": {
            const sorted = [...overlays].sort((a, b) => a.zIndex - b.zIndex);
            const idx = sorted.findIndex(o => o.id === action.id);
            if (idx <= 0) return overlays;
            const target = sorted[idx];
            const below = sorted[idx - 1];
            return overlays.map(o => {
                if (o.id === target.id) return { ...o, zIndex: below.zIndex };
                if (o.id === below.id) return { ...o, zIndex: target.zIndex };
                return o;
            });
        }

        case "SET_OVERLAYS":
            return action.overlays;

        default:
            return overlays;
    }
}
