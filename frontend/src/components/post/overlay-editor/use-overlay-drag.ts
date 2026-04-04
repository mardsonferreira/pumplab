import { useCallback, useRef } from "react";
import { clampBounds } from "./constants";

interface UseDragOptions {
    onMove: (x: number, y: number) => void;
    onEnd?: () => void;
    containerRef: React.RefObject<HTMLElement | null>;
    elementWidth: number;
    elementHeight: number;
}

/**
 * Returns a `onPointerDown` handler that starts a drag session.
 * Coordinates are normalized to the overlay coordinate space (matching
 * the container size) so the caller receives clamped pixel positions.
 */
export function useOverlayDrag({ onMove, onEnd, containerRef, elementWidth, elementHeight }: UseDragOptions) {
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const handlePointerDown = useCallback(
        (e: React.PointerEvent, currentX: number, currentY: number) => {
            e.preventDefault();
            e.stopPropagation();
            dragging.current = true;

            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();

            // Offset between pointer and element top-left in container-relative coordinates
            const scale = rect.width > 0 ? container.clientWidth / rect.width : 1;
            offset.current = {
                x: (e.clientX - rect.left) * scale - currentX,
                y: (e.clientY - rect.top) * scale - currentY,
            };

            const handlePointerMove = (ev: PointerEvent) => {
                if (!dragging.current || !container) return;
                const r = container.getBoundingClientRect();
                const s = r.width > 0 ? container.clientWidth / r.width : 1;
                const rawX = (ev.clientX - r.left) * s - offset.current.x;
                const rawY = (ev.clientY - r.top) * s - offset.current.y;
                const clamped = clampBounds(rawX, rawY, elementWidth, elementHeight, container.clientWidth, container.clientHeight);
                onMove(clamped.x, clamped.y);
            };

            const handlePointerUp = () => {
                dragging.current = false;
                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", handlePointerUp);
                onEnd?.();
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
        },
        [onMove, onEnd, containerRef, elementWidth, elementHeight],
    );

    return { handlePointerDown };
}
