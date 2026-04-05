import type { CSSProperties } from "react";
import type { TextOverlayItemProps } from "./types";

export function TextOverlayItem({ el, scale }: TextOverlayItemProps) {
    return (
        <div
            className="pointer-events-none h-full w-full select-none overflow-hidden whitespace-pre-wrap break-words [color:var(--overlay-text-color)] [font-size:var(--overlay-text-fs)] [line-height:var(--overlay-text-lh)]"
            style={
                {
                    "--overlay-text-fs": `${el.fontSize * scale}px`,
                    "--overlay-text-lh": String(el.lineHeight),
                    "--overlay-text-color": el.color,
                } as CSSProperties
            }
        >
            {el.text}
        </div>
    );
}
