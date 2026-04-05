import type { RefObject } from "react";

export interface UseOverlayDragOptions {
    onMove: (x: number, y: number) => void;
    onEnd?: () => void;
    containerRef: RefObject<HTMLElement | null>;
    elementWidth: number;
    elementHeight: number;
}
