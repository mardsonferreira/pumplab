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
                zIndex: 1000,
                minWidth: 220,
                maxWidth: "calc(100% - 4px)",
            }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
        >
            <div className="rounded-lg border border-zinc-500 bg-zinc-950 text-zinc-50 shadow-2xl ring-2 ring-black/40">
                <div className="flex items-center gap-1.5 px-2.5 py-2">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-200" title="Tamanho da fonte">
                        <span className="font-semibold select-none">Aa</span>
                        <input
                            type="number"
                            value={selected.fontSize}
                            onChange={handleFontSizeChange}
                            min={MIN_FONT_SIZE}
                            max={MAX_FONT_SIZE}
                            className="w-12 rounded-md border border-zinc-400 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950"
                        />
                    </label>

                    <label className="flex items-center" title="Cor do texto">
                        <input
                            type="color"
                            value={selected.color}
                            onChange={handleColorChange}
                            className="h-6 w-6 cursor-pointer rounded-md border-2 border-zinc-400 bg-white p-0 shadow-sm"
                        />
                    </label>

                    <div className="mx-0.5 h-5 w-px shrink-0 bg-zinc-500" />

                    <button
                        type="button"
                        title="Remover texto"
                        className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-950 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                        onClick={() => onDelete(selected.id)}
                    >
                        <FiTrash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
