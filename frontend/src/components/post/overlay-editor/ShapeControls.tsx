"use client";

import React, { useCallback } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { ShapeOverlay, ShapeType } from "@/types";

const SHAPE_OPTIONS: { value: ShapeType; label: string }[] = [
    { value: "rectangle", label: "Retângulo" },
    { value: "rounded_rectangle", label: "Retângulo arredondado" },
    { value: "circle", label: "Círculo" },
];

interface ShapeControlsProps {
    selected: ShapeOverlay | null;
    canAdd: boolean;
    onAddShape: (type: ShapeType) => void;
    onDelete: (id: string) => void;
    onUpdateShape: (id: string, patch: Partial<Pick<ShapeOverlay, "shapeType" | "color" | "filled" | "opacity">>) => void;
}

export function ShapeControls({ selected, canAdd, onAddShape, onDelete, onUpdateShape }: ShapeControlsProps) {
    const handleColorChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!selected) return;
            onUpdateShape(selected.id, { color: e.target.value });
        },
        [selected, onUpdateShape],
    );

    const handleFillToggle = useCallback(() => {
        if (!selected) return;
        onUpdateShape(selected.id, { filled: !selected.filled });
    }, [selected, onUpdateShape]);

    const handleOpacityChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!selected) return;
            onUpdateShape(selected.id, { opacity: Number(e.target.value) });
        },
        [selected, onUpdateShape],
    );

    const handleTypeChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (!selected) return;
            onUpdateShape(selected.id, { shapeType: e.target.value as ShapeType });
        },
        [selected, onUpdateShape],
    );

    return (
        <div className="flex flex-col gap-3 rounded-md border border-foreground/10 bg-background p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Formas</span>
                <div className="flex gap-1">
                    {SHAPE_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 disabled:opacity-40 disabled:pointer-events-none"
                            disabled={!canAdd}
                            onClick={() => onAddShape(opt.value)}
                            title={canAdd ? `Adicionar ${opt.label}` : "Limite de 10 elementos atingido"}
                        >
                            <FiPlus size={12} /> {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {selected ? (
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Tipo
                        <select
                            value={selected.shapeType}
                            onChange={handleTypeChange}
                            className="rounded border border-foreground/10 bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {SHAPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
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
                        <input
                            type="checkbox"
                            checked={selected.filled}
                            onChange={handleFillToggle}
                            className="rounded"
                        />
                        Preenchido
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Opacidade
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={selected.opacity}
                            onChange={handleOpacityChange}
                            className="w-20"
                        />
                        <span className="w-8 text-right text-xs">{Math.round(selected.opacity * 100)}%</span>
                    </label>
                    <button
                        type="button"
                        className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(selected.id)}
                    >
                        <FiTrash2 size={12} /> Remover
                    </button>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">Selecione uma forma para editar, ou adicione uma nova.</p>
            )}
        </div>
    );
}
