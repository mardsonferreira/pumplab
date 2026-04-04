export type ResizeHandleId = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** Apply pointer delta (container space) for a fixed-edge resize from `start`. */
export function applyResizeFromHandle(
    start: { x: number; y: number; width: number; height: number },
    handle: ResizeHandleId,
    dx: number,
    dy: number,
): { x: number; y: number; width: number; height: number } {
    const { x: x0, y: y0, width: w0, height: h0 } = start;
    switch (handle) {
        case "e":
            return { x: x0, y: y0, width: w0 + dx, height: h0 };
        case "w":
            return { x: x0 + dx, y: y0, width: w0 - dx, height: h0 };
        case "s":
            return { x: x0, y: y0, width: w0, height: h0 + dy };
        case "n":
            return { x: x0, y: y0 + dy, width: w0, height: h0 - dy };
        case "ne":
            return { x: x0, y: y0 + dy, width: w0 + dx, height: h0 - dy };
        case "nw":
            return { x: x0 + dx, y: y0 + dy, width: w0 - dx, height: h0 - dy };
        case "se":
            return { x: x0, y: y0, width: w0 + dx, height: h0 + dy };
        case "sw":
            return { x: x0 + dx, y: y0, width: w0 - dx, height: h0 + dy };
    }
}
