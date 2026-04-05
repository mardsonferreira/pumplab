import type { OverlayResizeHandlesProps } from "./types";

/** Hit target along edges; corners sit above edges in stacking order. */
const EDGE_HIT_CLASS = "h-2";
const CORNER_HIT_CLASS = "h-[11px] w-[11px]";

export function OverlayResizeHandles({ onHandlePointerDown }: OverlayResizeHandlesProps) {
    const edge = "pointer-events-auto touch-none absolute z-[30] bg-transparent";
    const corner = `${edge} z-[31]`;

    return (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
                className={`${edge} ${EDGE_HIT_CLASS} cursor-ns-resize left-[28%] right-[28%] top-0 -translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "n")}
            />
            <div
                className={`${edge} ${EDGE_HIT_CLASS} cursor-ns-resize bottom-0 left-[28%] right-[28%] translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "s")}
            />
            <div
                className={`${edge} ${EDGE_HIT_CLASS} w-2 cursor-ew-resize bottom-[14px] left-0 top-[14px] -translate-x-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "w")}
            />
            <div
                className={`${edge} ${EDGE_HIT_CLASS} w-2 cursor-ew-resize bottom-[14px] right-0 top-[14px] translate-x-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "e")}
            />
            <div
                className={`${corner} ${CORNER_HIT_CLASS} cursor-nwse-resize left-0 top-0 -translate-x-1/2 -translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "nw")}
            />
            <div
                className={`${corner} ${CORNER_HIT_CLASS} cursor-nesw-resize right-0 top-0 translate-x-1/2 -translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "ne")}
            />
            <div
                className={`${corner} ${CORNER_HIT_CLASS} cursor-nesw-resize bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "sw")}
            />
            <div
                className={`${corner} ${CORNER_HIT_CLASS} cursor-nwse-resize bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
                onPointerDown={e => onHandlePointerDown(e, "se")}
            />
        </div>
    );
}
