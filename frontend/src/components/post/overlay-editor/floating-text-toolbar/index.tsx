"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from "@/components/post/overlay-editor/constants";
import type { FloatingTextToolbarProps } from "./types";

/** Single controls row + padding/borders; used to place the toolbar above or below the overlay. */
const TOOLBAR_HEIGHT_ESTIMATE = 40;
const TOOLBAR_OFFSET = 6;

export function FloatingTextToolbar({ selected, scale = 1, onUpdateText, onDelete }: FloatingTextToolbarProps) {
    const yPx = selected.y * scale;
    const xPx = selected.x * scale;
    const hPx = selected.height * scale;
    const showAbove = yPx >= TOOLBAR_HEIGHT_ESTIMATE + TOOLBAR_OFFSET;
    const topPx = showAbove ? yPx - TOOLBAR_HEIGHT_ESTIMATE - TOOLBAR_OFFSET : yPx + hPx + TOOLBAR_OFFSET;

    /** Local string so the user can clear the field and type a new value; parent stores a clamped number. */
    const [fontSizeDraft, setFontSizeDraft] = useState(() => String(selected.fontSize));

    useEffect(() => {
        setFontSizeDraft(String(selected.fontSize));
    }, [selected.id, selected.fontSize]);

    const commitFontSize = useCallback(() => {
        const trimmed = fontSizeDraft.trim();
        const parsed = parseInt(trimmed, 10);
        if (trimmed === "" || !Number.isFinite(parsed)) {
            setFontSizeDraft(String(selected.fontSize));
            return;
        }
        const clamped = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, parsed));
        setFontSizeDraft(String(clamped));
        if (clamped !== selected.fontSize) {
            onUpdateText(selected.id, { fontSize: clamped });
        }
    }, [fontSizeDraft, selected.fontSize, selected.id, onUpdateText]);

    const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeDraft(e.target.value);
    }, []);

    const handleColorChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateText(selected.id, { color: e.target.value });
        },
        [selected.id, onUpdateText],
    );

    const positionStyle = {
        "--ft-top": `${topPx}px`,
        "--ft-left": `${Math.max(0, xPx)}px`,
    } as CSSProperties;

    return (
        <div
            className="absolute z-[1000] min-w-[220px] max-w-[calc(100%-4px)] [left:max(0px,var(--ft-left))] [top:var(--ft-top)]"
            style={positionStyle}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
        >
            <div className="rounded-lg border border-zinc-500 bg-zinc-950 text-zinc-50 shadow-2xl ring-2 ring-black/40">
                <div className="flex items-center gap-1.5 px-2.5 py-2">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-200" title="Tamanho da fonte">
                        <span className="select-none font-semibold">Aa</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={fontSizeDraft}
                            onChange={handleFontSizeChange}
                            onBlur={commitFontSize}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                            aria-label="Tamanho da fonte"
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
