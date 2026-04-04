"use client";

import React, { useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";
import type { TextOverlay } from "@/types";
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from "./constants";

/** Single controls row + padding/borders; used to place the toolbar above or below the overlay. */
const TOOLBAR_HEIGHT_ESTIMATE = 40;
const TOOLBAR_OFFSET = 6;

interface FloatingTextToolbarProps {
    selected: TextOverlay;
    onUpdateText: (id: string, patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>) => void;
    onDelete: (id: string) => void;
}

export function FloatingTextToolbar({ selected, onUpdateText, onDelete }: FloatingTextToolbarProps) {
    const showAbove = selected.y >= TOOLBAR_HEIGHT_ESTIMATE + TOOLBAR_OFFSET;
    const top = showAbove
        ? selected.y - TOOLBAR_HEIGHT_ESTIMATE - TOOLBAR_OFFSET
        : selected.y + selected.height + TOOLBAR_OFFSET;

    const handleFontSizeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, Number(e.target.value)));
            onUpdateText(selected.id, { fontSize: size });
        },
        [selected.id, onUpdateText],
    );

    const handleColorChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateText(selected.id, { color: e.target.value });
        },
        [selected.id, onUpdateText],
    );

    return (
        <div
            style={{
                position: "absolute",
                top,
                left: Math.max(0, selected.x),
                zIndex: 100,
                minWidth: 220,
                maxWidth: "calc(100% - 4px)",
            }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
        >
            <div className="rounded-md border border-foreground/20 bg-background shadow-md">
                <div className="flex items-center gap-1 px-2 py-1.5">
                    <label className="flex items-center gap-1 text-xs text-muted-foreground" title="Tamanho da fonte">
                        <span className="font-semibold select-none">Aa</span>
                        <input
                            type="number"
                            value={selected.fontSize}
                            onChange={handleFontSizeChange}
                            min={MIN_FONT_SIZE}
                            max={MAX_FONT_SIZE}
                            className="w-12 rounded border border-foreground/10 bg-background px-1 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </label>

                    <label className="flex items-center" title="Cor do texto">
                        <input
                            type="color"
                            value={selected.color}
                            onChange={handleColorChange}
                            className="h-5 w-5 cursor-pointer rounded border-none"
                        />
                    </label>

                    <div className="mx-1 h-4 w-px bg-foreground/20" />

                    <button
                        type="button"
                        title="Remover texto"
                        className="rounded p-1 text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(selected.id)}
                    >
                        <FiTrash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
