import type { TextOverlay } from "@/types";
import { clampBounds, clampOverlayRect, MAX_OVERLAYS_PER_SLIDE } from "./constants";

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type OverlayAction =
    | { type: "ADD_OVERLAY"; overlay: TextOverlay }
    | { type: "DELETE_OVERLAY"; id: string }
    | { type: "UPDATE_TEXT"; id: string; patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color" | "overflow">> }
    | { type: "MOVE"; id: string; x: number; y: number; containerW: number; containerH: number }
    | {
          type: "RESIZE";
          id: string;
          x: number;
          y: number;
          width: number;
          height: number;
          overflow: TextOverlay["overflow"];
          containerW: number;
          containerH: number;
      };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function overlayReducer(overlays: TextOverlay[], action: OverlayAction): TextOverlay[] {
    switch (action.type) {
        case "ADD_OVERLAY": {
            if (overlays.length >= MAX_OVERLAYS_PER_SLIDE) return overlays;
            return [...overlays, action.overlay];
        }

        case "DELETE_OVERLAY":
            return overlays.filter(o => o.id !== action.id);

        case "UPDATE_TEXT":
            return overlays.map(o => (o.id === action.id ? { ...o, ...action.patch } : o));

        case "MOVE":
            return overlays.map(o => {
                if (o.id !== action.id) return o;
                const clamped = clampBounds(
                    action.x,
                    action.y,
                    o.width,
                    o.height,
                    action.containerW,
                    action.containerH,
                );
                return { ...o, x: clamped.x, y: clamped.y };
            });

        case "RESIZE":
            return overlays.map(o => {
                if (o.id !== action.id) return o;
                const r = clampOverlayRect(
                    action.x,
                    action.y,
                    action.width,
                    action.height,
                    action.containerW,
                    action.containerH,
                );
                return { ...o, ...r, overflow: action.overflow };
            });
    }
}
