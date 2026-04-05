import type { TextOverlay } from "@/types";
import type { TextUpdatePatch } from "@/components/post/overlay-editor/types";

export interface FloatingTextToolbarProps {
    selected: TextOverlay;
    /** Multiply logical slide coordinates (1024×1024 space) to match the on-screen canvas. */
    scale?: number;
    onUpdateText: (id: string, patch: TextUpdatePatch) => void;
    onDelete: (id: string) => void;
}
