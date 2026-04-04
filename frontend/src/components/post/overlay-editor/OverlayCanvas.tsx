"use client";

import React, { useRef, useCallback, useMemo } from "react";
import type { OverlayElement, TextOverlay, ShapeOverlay, CarouselSlideEditState } from "@/types";
import { isTextOverlay, isShapeOverlay, SLIDE_WIDTH, SLIDE_HEIGHT } from "./constants";
import { useOverlayDrag } from "./use-overlay-drag";

// ---------------------------------------------------------------------------
// Single overlay element renderer
// ---------------------------------------------------------------------------

type TextUpdatePatch = Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>;

interface OverlayItemProps {
    element: OverlayElement;
    selected: boolean;
    containerRef: React.RefObject<HTMLElement | null>;
    scale: number;
    onSelect: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText?: (id: string, patch: TextUpdatePatch) => void;
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

function ShapeOverlayItem({ el }: { el: ShapeOverlay }) {
    const borderRadius = el.shapeType === "rounded_rectangle" ? "12px" : el.shapeType === "circle" ? "50%" : "0";
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius,
                backgroundColor: el.filled ? el.color : "transparent",
                border: el.filled ? "none" : `2px solid ${el.color}`,
                opacity: el.opacity,
                pointerEvents: "none",
            }}
        />
    );
}

const DRAG_RAIL_PX = 6;

function DraggableOverlay({ element, selected, containerRef, scale, onSelect, onMove, onUpdateText }: OverlayItemProps) {
    const { handlePointerDown } = useOverlayDrag({
        onMove: (x, y) => onMove(element.id, x / scale, y / scale),
        containerRef,
        elementWidth: element.width * scale,
        elementHeight: element.height * scale,
    });

    const isText = isTextOverlay(element);
    const inlineTextEdit = Boolean(isText && selected && onUpdateText);

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
            {isText && inlineTextEdit && onUpdateText && (
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
                        className="min-h-0 w-full flex-1 resize-none border-0 bg-transparent p-0 focus:outline-none"
                        style={{
                            fontSize: element.fontSize * scale,
                            lineHeight: element.lineHeight,
                            color: element.color,
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            boxSizing: "border-box",
                        }}
                    />
                </>
            )}
            {isText && !inlineTextEdit && <TextOverlayItem el={element} scale={scale} />}
            {isShapeOverlay(element) && <ShapeOverlayItem el={element} />}
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
}

export function OverlayCanvas({ slide, onSelect, onMove, onUpdateText }: OverlayCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scale = useMemo(() => {
        if (typeof window === "undefined") return 1;
        // Actual rendered width will be set by the parent; we normalize in layout
        return 1;
    }, []);

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

    if (slide.imageStatus === "failed") {
        return (
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
                            scale={1}
                            onSelect={(id) => onSelect(id)}
                            onMove={onMove}
                            onUpdateText={onUpdateText}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
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
                    scale={1}
                    onSelect={(id) => onSelect(id)}
                    onMove={onMove}
                    onUpdateText={onUpdateText}
                />
            ))}
        </div>
    );
}
