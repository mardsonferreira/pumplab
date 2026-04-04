"use client";

import React, { useCallback } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { TextOverlay } from "@/types";
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from "./constants";

interface TextControlsProps {
    selected: TextOverlay | null;
    canAdd: boolean;
    onAddText: () => void;
    onDelete: (id: string) => void;
    onUpdateText: (id: string, patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>) => void;
}

export function TextControls({ selected, canAdd, onAddText, onDelete, onUpdateText }: TextControlsProps) {
    const handleContentChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (!selected) return;
            onUpdateText(selected.id, { text: e.target.value });
        },
        [selected, onUpdateText],
    );

    const handleColorChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!selected) return;
            onUpdateText(selected.id, { color: e.target.value });
        },
        [selected, onUpdateText],
    );

    const handleFontSizeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!selected) return;
            const size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, Number(e.target.value)));
            onUpdateText(selected.id, { fontSize: size });
        },
        [selected, onUpdateText],
    );

    return (
        <div className="flex flex-col gap-3 rounded-md border border-foreground/10 bg-background p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Texto</span>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 disabled:opacity-40 disabled:pointer-events-none"
                    disabled={!canAdd}
                    onClick={onAddText}
                    title={canAdd ? "Adicionar caixa de texto" : "Limite de 10 elementos atingido"}
                >
                    <FiPlus size={14} /> Novo
                </button>
            </div>

            {selected ? (
                <>
                    <textarea
                        value={selected.text}
                        onChange={handleContentChange}
                        rows={3}
                        className="w-full resize-none rounded border border-foreground/10 bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            Cor
                            <input
                                type="color"
                                value={selected.color}
                                onChange={handleColorChange}
                                className="h-6 w-6 cursor-pointer rounded border-none"
                            />
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            Tamanho
                            <input
                                type="number"
                                value={selected.fontSize}
                                onChange={handleFontSizeChange}
                                min={MIN_FONT_SIZE}
                                max={MAX_FONT_SIZE}
                                className="w-14 rounded border border-foreground/10 bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </label>
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(selected.id)}
                        >
                            <FiTrash2 size={12} /> Remover
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-xs text-muted-foreground">Selecione uma caixa de texto para editar.</p>
            )}
        </div>
    );
}
