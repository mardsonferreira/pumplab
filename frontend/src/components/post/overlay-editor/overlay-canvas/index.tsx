"use client";

import { useCallback, useMemo, useRef } from "react";
import { DraggableOverlay } from "@/components/post/overlay-editor/draggable-overlay";
import { FloatingTextToolbar } from "@/components/post/overlay-editor/floating-text-toolbar";
import { useSlideScale } from "./use-slide-scale";
import type { OverlayCanvasProps } from "./types";

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

    const overlayNodes = sortedOverlays.map(el => (
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
    ));

    if (slide.imageStatus === "failed") {
        return (
            <div className="relative w-full">
                <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-2 bg-destructive/10 p-4">
                    <p className="text-sm font-medium text-destructive">
                        {slide.imageErrorMessage ?? "Falha ao carregar imagem."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Você pode tentar novamente ou continuar editando os overlays.
                    </p>
                    <div ref={containerRef} className="absolute inset-0" onClick={handleBackgroundClick}>
                        {overlayNodes}
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
                {overlayNodes}
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
