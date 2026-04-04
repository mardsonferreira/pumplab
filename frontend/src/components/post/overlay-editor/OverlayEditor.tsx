"use client";

/**
 * Scope-limited overlay editor — NFR-003 guardrail.
 *
 * This editor intentionally exposes ONLY:
 * - Text: content, position (drag), font size, color
 * - Shape: type (rect/rounded/circle), color, fill toggle, opacity
 * - Layer order: bring forward / send backward (LayerControls panel only; carousel floating toolbar has no z-order)
 * - Delete any element
 *
 * Rotation, blur/effects, font families, gradients, and other advanced
 * design controls are deliberately excluded per spec.
 */

import React, { useCallback, useMemo } from "react";
import type { OverlayElement, TextOverlay, ShapeOverlay, ShapeType, CarouselSlideEditState } from "@/types";
import { isTextOverlay, isShapeOverlay, canAddOverlay, SLIDE_WIDTH, SLIDE_HEIGHT } from "./constants";
import { createTextOverlay, createShapeOverlay } from "./factories";
import { overlayReducer } from "./state";
import { computeTextFit } from "./text-fit";
import { OverlayCanvas } from "./OverlayCanvas";
import { TextControls } from "./TextControls";
import { ShapeControls } from "./ShapeControls";
import { LayerControls } from "./LayerControls";
import { OverlayFeedback } from "./OverlayFeedback";

interface OverlayEditorProps {
    slide: CarouselSlideEditState;
    onOverlaysChange: (overlays: OverlayElement[]) => void;
    onSelect: (id: string | null) => void;
}

export function OverlayEditor({ slide, onOverlaysChange, onSelect }: OverlayEditorProps) {
    const dispatch = useCallback(
        (action: Parameters<typeof overlayReducer>[1]) => {
            const next = overlayReducer(slide.overlays, action);
            onOverlaysChange(next);
        },
        [slide.overlays, onOverlaysChange],
    );

    const selectedElement = useMemo(
        () => slide.overlays.find(o => o.id === slide.selectedOverlayId) ?? null,
        [slide.overlays, slide.selectedOverlayId],
    );

    const selectedText: TextOverlay | null = selectedElement && isTextOverlay(selectedElement) ? selectedElement : null;
    const selectedShape: ShapeOverlay | null = selectedElement && isShapeOverlay(selectedElement) ? selectedElement : null;

    const handleAddText = useCallback(() => {
        const maxZ = slide.overlays.reduce((m, o) => Math.max(m, o.zIndex), 0);
        const overlay = createTextOverlay("Novo texto", maxZ);
        dispatch({ type: "ADD_OVERLAY", overlay });
        onSelect(overlay.id);
    }, [slide.overlays, dispatch, onSelect]);

    const handleAddShape = useCallback(
        (shapeType: ShapeType) => {
            const minZ = slide.overlays.reduce((m, o) => Math.min(m, o.zIndex), 0);
            const overlay = createShapeOverlay(shapeType, minZ);
            dispatch({ type: "ADD_OVERLAY", overlay });
            onSelect(overlay.id);
        },
        [slide.overlays, dispatch, onSelect],
    );

    const handleDelete = useCallback(
        (id: string) => {
            dispatch({ type: "DELETE_OVERLAY", id });
            onSelect(null);
        },
        [dispatch, onSelect],
    );

    const handleUpdateText = useCallback(
        (id: string, patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>) => {
            let fullPatch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color" | "overflow">> = { ...patch };
            if (patch.text !== undefined || patch.fontSize !== undefined) {
                const el = slide.overlays.find(o => o.id === id);
                if (el && isTextOverlay(el)) {
                    const text = patch.text ?? el.text;
                    const fontSize = patch.fontSize ?? el.fontSize;
                    const { overflow } = computeTextFit(text, fontSize, el.width, el.height, el.lineHeight);
                    fullPatch = { ...fullPatch, overflow };
                }
            }
            dispatch({ type: "UPDATE_TEXT", id, patch: fullPatch });
        },
        [dispatch, slide.overlays],
    );

    const handleUpdateShape = useCallback(
        (id: string, patch: Partial<Pick<ShapeOverlay, "shapeType" | "color" | "filled" | "opacity">>) => {
            dispatch({ type: "UPDATE_SHAPE", id, patch });
        },
        [dispatch],
    );

    const handleMove = useCallback(
        (id: string, x: number, y: number) => {
            dispatch({ type: "MOVE", id, x, y, containerW: SLIDE_WIDTH, containerH: SLIDE_HEIGHT });
        },
        [dispatch],
    );

    return (
        <div className="flex flex-col gap-3">
            <OverlayCanvas
                slide={slide}
                onSelect={onSelect}
                onMove={handleMove}
                onUpdateText={handleUpdateText}
            />
            <OverlayFeedback overlays={slide.overlays} selected={selectedElement} />
            <TextControls
                selected={selectedText}
                canAdd={canAddOverlay(slide.overlays.length)}
                onAddText={handleAddText}
                onDelete={handleDelete}
                onUpdateText={handleUpdateText}
            />
            <ShapeControls
                selected={selectedShape}
                canAdd={canAddOverlay(slide.overlays.length)}
                onAddShape={handleAddShape}
                onDelete={handleDelete}
                onUpdateShape={handleUpdateShape}
            />
            <LayerControls
                selectedId={slide.selectedOverlayId}
                onBringForward={(id) => dispatch({ type: "BRING_FORWARD", id })}
                onSendBackward={(id) => dispatch({ type: "SEND_BACKWARD", id })}
            />
        </div>
    );
}
