import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import { SLIDE_WIDTH } from "@/components/post/overlay-editor/constants";

export function useSlideScale(
    containerRef: RefObject<HTMLElement | null>,
    /** When the canvas mounts a different DOM subtree (e.g. failed vs loaded image), re-attach the observer. */
    layoutKey: string,
): number {
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const update = () => {
            const w = el.clientWidth;
            if (w > 0) setScale(w / SLIDE_WIDTH);
        };

        update();
        const ro = new ResizeObserver(entries => {
            const w = entries[0]?.contentRect.width ?? el.clientWidth;
            if (w > 0) setScale(w / SLIDE_WIDTH);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [containerRef, layoutKey]);

    return scale;
}
