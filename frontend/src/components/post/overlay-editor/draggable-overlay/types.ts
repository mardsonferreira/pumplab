import type { RefObject } from "react";
import type { TextOverlay } from "@/types";
import type { TextUpdatePatch } from "@/components/post/overlay-editor/types";

export interface DraggableOverlayProps {
    element: TextOverlay;
    selected: boolean;
    containerRef: RefObject<HTMLElement | null>;
    scale: number;
    onSelect: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText?: (id: string, patch: TextUpdatePatch) => void;
    onResize?: (id: string, x: number, y: number, width: number, height: number) => void;
}
