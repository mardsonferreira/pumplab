"use client";

import { useCallback, useMemo } from "react";
import type { CSSProperties } from "react";
import { useOverlayDrag } from "@/components/post/overlay-editor/use-overlay-drag";
import { useOverlayResize } from "@/components/post/overlay-editor/use-overlay-resize";
import { OverlayResizeHandles } from "@/components/post/overlay-editor/overlay-resize-handles";
import { TextOverlayItem } from "@/components/post/overlay-editor/text-overlay-item";
import { cn } from "@/utils/cn";
import type { DraggableOverlayProps } from "./types";

export function DraggableOverlay({
    element,
    selected,
    containerRef,
    scale,
    onSelect,
    onMove,
    onUpdateText,
    onResize,
}: DraggableOverlayProps) {
    const rectScaled = useMemo(
        () => ({
            x: element.x * scale,
            y: element.y * scale,
            width: element.width * scale,
            height: element.height * scale,
        }),
        [element.x, element.y, element.width, element.height, scale],
    );

    const { handlePointerDown } = useOverlayDrag({
        onMove: (x, y) => onMove(element.id, x / scale, y / scale),
        containerRef,
        elementWidth: element.width * scale,
        elementHeight: element.height * scale,
    });

    const onResizeLogical = useCallback(
        (x: number, y: number, width: number, height: number) => {
            onResize?.(element.id, x, y, width, height);
        },
        [element.id, onResize],
    );

    const { handleResizePointerDown } = useOverlayResize({
        onResize: onResizeLogical,
        containerRef,
        scale,
    });

    const inlineTextEdit = Boolean(selected && onUpdateText);
    const showResizeHandles = Boolean(selected && onResize);

    const startDrag = useCallback(
        (e: React.PointerEvent, currentX: number, currentY: number) => {
            onSelect(element.id);
            handlePointerDown(e, currentX, currentY);
        },
        [element.id, onSelect, handlePointerDown],
    );

    const boxStyle = {
        "--overlay-x": `${element.x * scale}px`,
        "--overlay-y": `${element.y * scale}px`,
        "--overlay-w": `${element.width * scale}px`,
        "--overlay-h": `${element.height * scale}px`,
        "--overlay-z": String(element.zIndex),
    } as CSSProperties;

    return (
        <div
            data-overlay-id={element.id}
            className={cn(
                "absolute touch-none box-border [left:var(--overlay-x)] [top:var(--overlay-y)] [width:var(--overlay-w)] [height:var(--overlay-h)] [z-index:var(--overlay-z)]",
                inlineTextEdit ? "flex cursor-default flex-col" : "cursor-move",
                selected ? "outline outline-2 outline-blue-500 outline-offset-1" : "outline-none",
            )}
            style={boxStyle}
            onPointerDown={e => {
                onSelect(element.id);
                if (!inlineTextEdit) {
                    handlePointerDown(e, element.x * scale, element.y * scale);
                }
            }}
        >
            {showResizeHandles && (
                <OverlayResizeHandles
                    onHandlePointerDown={(e, handle) => {
                        onSelect(element.id);
                        handleResizePointerDown(e, handle, rectScaled);
                    }}
                />
            )}
            {inlineTextEdit && onUpdateText && (
                <>
                    <div
                        className="h-[6px] min-h-[6px] shrink-0 touch-none cursor-grab active:cursor-grabbing"
                        onPointerDown={e => {
                            e.stopPropagation();
                            startDrag(e, element.x * scale, element.y * scale);
                        }}
                    />
                    <textarea
                        value={element.text}
                        onChange={e => onUpdateText(element.id, { text: e.target.value })}
                        onPointerDown={e => e.stopPropagation()}
                        rows={1}
                        className="min-h-0 w-full flex-1 touch-manipulation resize-none border-0 bg-transparent p-0 [color:var(--ta-color)] [font-size:var(--ta-fs)] [line-height:var(--ta-lh)] focus:outline-none"
                        style={
                            {
                                "--ta-fs": `${element.fontSize * scale}px`,
                                "--ta-lh": String(element.lineHeight),
                                "--ta-color": element.color,
                            } as CSSProperties
                        }
                    />
                </>
            )}
            {!inlineTextEdit && <TextOverlayItem el={element} scale={scale} />}
        </div>
    );
}
