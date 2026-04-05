import type { PointerEvent } from "react";
import type { ResizeHandleId } from "@/components/post/overlay-editor/resize-geometry";

export interface OverlayResizeHandlesProps {
    onHandlePointerDown: (e: PointerEvent<HTMLDivElement>, handle: ResizeHandleId) => void;
}
