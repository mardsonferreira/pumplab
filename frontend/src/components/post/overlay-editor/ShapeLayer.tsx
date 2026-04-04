"use client";

import React from "react";
import type { ShapeOverlay } from "@/types";

interface ShapeLayerProps {
    shape: ShapeOverlay;
    scale?: number;
}

function borderRadiusFor(shapeType: ShapeOverlay["shapeType"]): string {
    switch (shapeType) {
        case "rounded_rectangle": return "12px";
        case "circle":            return "50%";
        default:                  return "0";
    }
}

export function ShapeLayer({ shape, scale = 1 }: ShapeLayerProps) {
    return (
        <div
            style={{
                width: shape.width * scale,
                height: shape.height * scale,
                borderRadius: borderRadiusFor(shape.shapeType),
                backgroundColor: shape.filled ? shape.color : "transparent",
                border: shape.filled ? "none" : `2px solid ${shape.color}`,
                opacity: shape.opacity,
                pointerEvents: "none",
            }}
        />
    );
}
