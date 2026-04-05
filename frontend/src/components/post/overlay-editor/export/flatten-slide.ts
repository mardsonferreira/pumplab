import type { CarouselSlideEditState, TextOverlay } from "@/types";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "../constants";
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

    if (slide.baseImageUrl) {
        const img = await loadImage(slide.baseImageUrl);
        ctx.drawImage(img, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
    } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
    }

    const sorted = [...slide.overlays].sort((a, b) => a.zIndex - b.zIndex);
    for (const el of sorted) {
        drawText(ctx, el);
    }

    const dataUrl = canvas.toDataURL("image/png");
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
