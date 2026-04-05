import type { CarouselSlideEditState } from "@/types";
import type { TextUpdatePatch } from "@/components/post/overlay-editor/types";

export interface OverlayCanvasProps {
    slide: CarouselSlideEditState;
    onSelect: (id: string | null) => void;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText?: (id: string, patch: TextUpdatePatch) => void;
    onResize?: (id: string, x: number, y: number, width: number, height: number) => void;
    /** When true, show the style toolbar for the selected overlay (active carousel slide only). */
    isActive?: boolean;
    onDeleteOverlay?: (id: string) => void;
}
