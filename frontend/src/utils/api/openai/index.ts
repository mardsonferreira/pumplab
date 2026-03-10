import { apiFetch, BackendUnavailableError } from "@/lib/api/client";
import type { CarouselPromptObject, Narrative } from "@/types";

export async function generateNarratives(prompt: string): Promise<Narrative[]> {
    const res = await apiFetch("/openai/narratives", {
        method: "POST",
        body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado.");
        if (res.status === 502 || res.status === 503) throw new BackendUnavailableError();
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Falha ao gerar narrativas.");
    }
    const data = (await res.json()) as { narratives?: Narrative[] };
    return Array.isArray(data.narratives) ? data.narratives : [];
}

export async function generateCarouselMasterPrompt(
    prompt: string
): Promise<CarouselPromptObject> {
    const res = await apiFetch("/openai/carousel-master-prompt", {
        method: "POST",
        body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado.");
        if (res.status === 502 || res.status === 503) throw new BackendUnavailableError();
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Falha ao gerar prompt.");
    }
    return (await res.json()) as CarouselPromptObject;
}

export async function generateCarouselImages(
    slides: {
        image_prompt: string;
        text?: string;
        role?: string;
    }[],
    style?: { color_palette: string; visual_style: string }
): Promise<string[]> {
    const res = await apiFetch("/openai/carousel-images", {
        method: "POST",
        body: JSON.stringify(style ? { slides, style } : { slides }),
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado.");
        if (res.status === 502 || res.status === 503) throw new BackendUnavailableError();
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Falha ao gerar imagens.");
    }
    const data = (await res.json()) as { urls?: string[] };
    return data.urls ?? [];
}

export async function exportCarouselPost(
    caption: string,
    slides: { index: number; image_url?: string; text: string }[]
): Promise<Blob> {
    const res = await apiFetch("/openai/carousel-export", {
        method: "POST",
        body: JSON.stringify({
            caption,
            slides: slides.map(s => ({
                index: s.index,
                image_url: s.image_url ?? "",
                text: s.text,
            })),
        }),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string }).error ?? "Falha ao exportar.";
        if (res.status === 400) throw new Error(msg);
        if (res.status === 502) throw new Error(msg);
        throw new Error(msg);
    }
    return res.blob();
}
