import type { CarouselSlideEditState, OverlayElement, TextOverlay, ShapeOverlay } from "@/types";
import { isTextOverlay, isShapeOverlay, SLIDE_WIDTH, SLIDE_HEIGHT } from "../constants";
import { wrapText } from "../text-fit";

/**
 * Flatten a slide's base image + overlays into a single PNG base64 string
 * (without the `data:image/png;base64,` prefix) for WYSIWYG export.
 */
export async function flattenSlide(slide: CarouselSlideEditState): Promise<string> {
    const canvas = document.createElement("canvas");
    canvas.width = SLIDE_WIDTH;
    canvas.height = SLIDE_HEIGHT;
    const ctx = canvas.getContext("2d")!;

    // Draw background image
    if (slide.baseImageUrl) {
        const img = await loadImage(slide.baseImageUrl);
        ctx.drawImage(img, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
    } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
    }

    // Draw overlays sorted by z-index
    const sorted = [...slide.overlays].sort((a, b) => a.zIndex - b.zIndex);
    for (const el of sorted) {
        if (isShapeOverlay(el)) drawShape(ctx, el);
        if (isTextOverlay(el)) drawText(ctx, el);
    }

    const dataUrl = canvas.toDataURL("image/png");
    // Strip the data URL prefix to send raw base64
    return dataUrl.replace(/^data:image\/png;base64,/, "");
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function drawShape(ctx: CanvasRenderingContext2D, el: ShapeOverlay) {
    ctx.save();
    ctx.globalAlpha = el.opacity;

    if (el.shapeType === "circle") {
        const rx = el.width / 2;
        const ry = el.height / 2;
        ctx.beginPath();
        ctx.ellipse(el.x + rx, el.y + ry, rx, ry, 0, 0, Math.PI * 2);
        if (el.filled) {
            ctx.fillStyle = el.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    } else {
        const radius = el.shapeType === "rounded_rectangle" ? 12 : 0;
        if (radius) {
            roundRect(ctx, el.x, el.y, el.width, el.height, radius);
        } else {
            ctx.beginPath();
            ctx.rect(el.x, el.y, el.width, el.height);
        }
        if (el.filled) {
            ctx.fillStyle = el.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    ctx.restore();
}

function drawText(ctx: CanvasRenderingContext2D, el: TextOverlay) {
    ctx.save();
    ctx.font = `${el.fontSize}px sans-serif`;
    ctx.fillStyle = el.color;
    ctx.textBaseline = "top";

    const lines = wrapText(ctx, el.text, el.width);
    let y = el.y;
    for (const line of lines) {
        if (y + el.fontSize * el.lineHeight > el.y + el.height) break;
        ctx.fillText(line, el.x, y);
        y += el.fontSize * el.lineHeight;
    }
    ctx.restore();
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
