"use client";

import React from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface LayerControlsProps {
    selectedId: string | null;
    onBringForward: (id: string) => void;
    onSendBackward: (id: string) => void;
}

export function LayerControls({ selectedId, onBringForward, onSendBackward }: LayerControlsProps) {
    if (!selectedId) return null;

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Camada:</span>
            <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
                onClick={() => onBringForward(selectedId)}
                title="Trazer para frente"
            >
                <FiArrowUp size={12} /> Frente
            </button>
            <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
                onClick={() => onSendBackward(selectedId)}
                title="Enviar para trás"
            >
                <FiArrowDown size={12} /> Trás
            </button>
        </div>
    );
}
