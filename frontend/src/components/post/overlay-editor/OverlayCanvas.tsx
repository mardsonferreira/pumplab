"use client";

import React, { useRef, useCallback, useMemo, useState, useLayoutEffect } from "react";
import type { TextOverlay, CarouselSlideEditState } from "@/types";
import { useOverlayDrag } from "./use-overlay-drag";
import { useOverlayResize } from "./use-overlay-resize";
import type { ResizeHandleId } from "./resize-geometry";
import { FloatingTextToolbar } from "./FloatingTextToolbar";
import { SLIDE_WIDTH } from "./constants";

// ---------------------------------------------------------------------------
// Single overlay element renderer
// ---------------------------------------------------------------------------

type TextUpdatePatch = Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>;

interface OverlayItemProps {
    element: TextOverlay;
    selected: boolean;
    containerRef: React.RefObject<HTMLElement | null>;
    scale: number;
    onSelect: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText?: (id: string, patch: TextUpdatePatch) => void;
    onResize?: (id: string, x: number, y: number, width: number, height: number) => void;
}

function TextOverlayItem({ el, scale }: { el: TextOverlay; scale: number }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                fontSize: el.fontSize * scale,
                lineHeight: el.lineHeight,
                color: el.color,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                overflow: "hidden",
                userSelect: "none",
                pointerEvents: "none",
            }}
        >
            {el.text}
        </div>
    );
}

const DRAG_RAIL_PX = 6;
/** Hit target along edges; corners sit above edges in stacking order. */
const EDGE_HIT_PX = 8;
const CORNER_HIT_PX = 11;
const EDGE_INSET = 14;

function OverlayResizeHandles({
    onHandlePointerDown,
}: {
    onHandlePointerDown: (e: React.PointerEvent, handle: ResizeHandleId) => void;
}) {
    // Invisible hit targets only; outline + cursor communicate selection and resize affordance.
    const edge = "pointer-events-auto touch-none absolute z-[30] bg-transparent";
    const corner = `${edge} z-[31]`;

    return (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
                className={`${edge} cursor-ns-resize`}
                style={{
                    left: "28%",
                    right: "28%",
                    top: 0,
                    height: EDGE_HIT_PX,
                    transform: "translateY(-50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "n")}
            />
            <div
                className={`${edge} cursor-ns-resize`}
                style={{
                    left: "28%",
                    right: "28%",
                    bottom: 0,
                    height: EDGE_HIT_PX,
                    transform: "translateY(50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "s")}
            />
            <div
                className={`${edge} cursor-ew-resize`}
                style={{
                    top: EDGE_INSET,
                    bottom: EDGE_INSET,
                    left: 0,
                    width: EDGE_HIT_PX,
                    transform: "translateX(-50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "w")}
            />
            <div
                className={`${edge} cursor-ew-resize`}
                style={{
                    top: EDGE_INSET,
                    bottom: EDGE_INSET,
                    right: 0,
                    width: EDGE_HIT_PX,
                    transform: "translateX(50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "e")}
            />
            <div
                className={`${corner} cursor-nwse-resize`}
                style={{
                    left: 0,
                    top: 0,
                    width: CORNER_HIT_PX,
                    height: CORNER_HIT_PX,
                    transform: "translate(-50%, -50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "nw")}
            />
            <div
                className={`${corner} cursor-nesw-resize`}
                style={{
                    right: 0,
                    top: 0,
                    width: CORNER_HIT_PX,
                    height: CORNER_HIT_PX,
                    transform: "translate(50%, -50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "ne")}
            />
            <div
                className={`${corner} cursor-nesw-resize`}
                style={{
                    left: 0,
                    bottom: 0,
                    width: CORNER_HIT_PX,
                    height: CORNER_HIT_PX,
                    transform: "translate(-50%, 50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "sw")}
            />
            <div
                className={`${corner} cursor-nwse-resize`}
                style={{
                    right: 0,
                    bottom: 0,
                    width: CORNER_HIT_PX,
                    height: CORNER_HIT_PX,
                    transform: "translate(50%, 50%)",
                }}
                onPointerDown={e => onHandlePointerDown(e, "se")}
            />
        </div>
    );
}

function DraggableOverlay({
    element,
    selected,
    containerRef,
    scale,
    onSelect,
    onMove,
    onUpdateText,
    onResize,
}: OverlayItemProps) {
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

    return (
        <div
            data-overlay-id={element.id}
            className="touch-none"
            style={{
                position: "absolute",
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
                zIndex: element.zIndex,
                cursor: inlineTextEdit ? "default" : "move",
                outline: selected ? "2px solid #3b82f6" : "none",
                outlineOffset: 1,
                boxSizing: "border-box",
                display: inlineTextEdit ? "flex" : undefined,
                flexDirection: inlineTextEdit ? "column" : undefined,
            }}
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
                        className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
                        style={{ height: DRAG_RAIL_PX, minHeight: DRAG_RAIL_PX }}
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
                        className="min-h-0 w-full flex-1 touch-manipulation resize-none border-0 bg-transparent p-0 focus:outline-none"
                        style={{
                            fontSize: element.fontSize * scale,
                            lineHeight: element.lineHeight,
                            color: element.color,
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            boxSizing: "border-box",
                            touchAction: "manipulation",
                        }}
                    />
                </>
            )}
            {!inlineTextEdit && <TextOverlayItem el={element} scale={scale} />}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Canvas component
// ---------------------------------------------------------------------------

interface OverlayCanvasProps {
    slide: CarouselSlideEditState;
    onSelect: (id: string | null) => void;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText?: (id: string, patch: TextUpdatePatch) => void;
    onResize?: (id: string, x: number, y: number, width: number, height: number) => void;
    /** When true, show the style toolbar for the selected overlay (active carousel slide only). */
    isActive?: boolean;
    onDeleteOverlay?: (id: string) => void;
}

function useSlideScale(
    containerRef: React.RefObject<HTMLElement | null>,
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

export function OverlayCanvas({
    slide,
    onSelect,
    onMove,
    onUpdateText,
    onResize,
    isActive = true,
    onDeleteOverlay,
}: OverlayCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scaleLayoutKey =
        slide.imageStatus === "failed" ? "failed" : slide.baseImageUrl ? "image" : slide.imageStatus;
    const scale = useSlideScale(containerRef, scaleLayoutKey);

    const sortedOverlays = useMemo(
        () => [...slide.overlays].sort((a, b) => a.zIndex - b.zIndex),
        [slide.overlays],
    );

    const handleBackgroundClick = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest("[data-overlay-id]")) return;
            onSelect(null);
        },
        [onSelect],
    );

    const selectedOverlay = sortedOverlays.find(o => o.id === slide.selectedOverlayId) ?? null;

    if (slide.imageStatus === "failed") {
        return (
            <div className="relative w-full">
                <div className="relative aspect-square w-full bg-destructive/10 flex flex-col items-center justify-center gap-2 p-4">
                    <p className="text-sm font-medium text-destructive">
                        {slide.imageErrorMessage ?? "Falha ao carregar imagem."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Você pode tentar novamente ou continuar editando os overlays.
                    </p>
                    <div
                        ref={containerRef}
                        className="absolute inset-0"
                        onClick={handleBackgroundClick}
                    >
                        {sortedOverlays.map(el => (
                            <DraggableOverlay
                                key={el.id}
                                element={el}
                                selected={el.id === slide.selectedOverlayId}
                                containerRef={containerRef}
                                scale={scale}
                                onSelect={id => onSelect(id)}
                                onMove={onMove}
                                onUpdateText={onUpdateText}
                                onResize={onResize}
                            />
                        ))}
                    </div>
                </div>
                {isActive && selectedOverlay && onUpdateText && onDeleteOverlay && (
                    <FloatingTextToolbar
                        selected={selectedOverlay}
                        scale={scale}
                        onUpdateText={onUpdateText}
                        onDelete={onDeleteOverlay}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <div
                ref={containerRef}
                className="relative aspect-square w-full overflow-hidden bg-background"
                onClick={handleBackgroundClick}
            >
                {slide.baseImageUrl && (
                    <img
                        src={slide.baseImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                )}
                {!slide.baseImageUrl && slide.imageStatus === "pending" && (
                    <div className="flex h-full w-full items-center justify-center bg-muted/50">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                )}
                {sortedOverlays.map(el => (
                    <DraggableOverlay
                        key={el.id}
                        element={el}
                        selected={el.id === slide.selectedOverlayId}
                        containerRef={containerRef}
                        scale={scale}
                        onSelect={id => onSelect(id)}
                        onMove={onMove}
                        onUpdateText={onUpdateText}
                        onResize={onResize}
                    />
                ))}
            </div>
            {isActive && selectedOverlay && onUpdateText && onDeleteOverlay && (
                <FloatingTextToolbar
                    selected={selectedOverlay}
                    scale={scale}
                    onUpdateText={onUpdateText}
                    onDelete={onDeleteOverlay}
                />
            )}
        </div>
    );
}
