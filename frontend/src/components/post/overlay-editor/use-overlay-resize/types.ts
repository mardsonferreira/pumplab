import type { RefObject } from "react";

export interface UseOverlayResizeOptions {
    onResize: (x: number, y: number, width: number, height: number) => void;
    containerRef: RefObject<HTMLElement | null>;
    scale: number;
}
