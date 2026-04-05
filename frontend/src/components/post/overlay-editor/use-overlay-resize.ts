import { useCallback, useRef } from "react";
import { applyResizeFromHandle, type ResizeHandleId } from "./resize-geometry";

interface UseOverlayResizeOptions {
    onResize: (x: number, y: number, width: number, height: number) => void;
    containerRef: React.RefObject<HTMLElement | null>;
    scale: number;
}

function pointerDeltaInContainerSpace(
    container: HTMLElement,
    clientDx: number,
    clientDy: number,
): { dx: number; dy: number } {
    const r = container.getBoundingClientRect();
    const s = r.width > 0 ? container.clientWidth / r.width : 1;
    return { dx: clientDx * s, dy: clientDy * s };
}

/**
 * Pointer-driven resize from a handle; deltas match overlay drag coordinate space.
 */
export function useOverlayResize({ onResize, containerRef, scale }: UseOverlayResizeOptions) {
    const session = useRef<{
        handle: ResizeHandleId;
        startRect: { x: number; y: number; width: number; height: number };
        startClientX: number;
        startClientY: number;
    } | null>(null);

    const handleResizePointerDown = useCallback(
        (e: React.PointerEvent, handle: ResizeHandleId, startRect: { x: number; y: number; width: number; height: number }) => {
            e.preventDefault();
            e.stopPropagation();
            const container = containerRef.current;
            if (!container) return;

            const captureTarget = e.currentTarget;
            if (captureTarget instanceof HTMLElement && e.pointerId != null) {
                try {
                    captureTarget.setPointerCapture(e.pointerId);
                } catch {
                    /* noop */
                }
            }

            session.current = {
                handle,
                startRect: { ...startRect },
                startClientX: e.clientX,
                startClientY: e.clientY,
            };

            const onMove = (ev: PointerEvent) => {
                const s = session.current;
                if (!s || !container) return;
                ev.preventDefault();
                const { dx, dy } = pointerDeltaInContainerSpace(
                    container,
                    ev.clientX - s.startClientX,
                    ev.clientY - s.startClientY,
                );
                const next = applyResizeFromHandle(s.startRect, s.handle, dx, dy);
                onResize(next.x / scale, next.y / scale, next.width / scale, next.height / scale);
            };

            const onUp = (ev: PointerEvent) => {
                session.current = null;
                if (captureTarget instanceof HTMLElement && ev.pointerId != null) {
                    try {
                        captureTarget.releasePointerCapture(ev.pointerId);
                    } catch {
                        /* noop */
                    }
                }
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
            };

            window.addEventListener("pointermove", onMove, { passive: false });
            window.addEventListener("pointerup", onUp);
            window.addEventListener("pointercancel", onUp);
        },
        [onResize, containerRef, scale],
    );

    return { handleResizePointerDown };
}
