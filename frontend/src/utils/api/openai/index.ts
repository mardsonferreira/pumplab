import { apiFetch, BackendUnavailableError } from "@/lib/api/client";
import type { Narrative } from "@/types";

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

export async function generateCarouselMasterPrompt(prompt: string): Promise<string> {
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
    const data = (await res.json()) as { content?: string };
    return data.content ?? "";
}

export async function generateCarouselImages(slides: { image_prompt: string }[]): Promise<string[]> {
    const res = await apiFetch("/openai/carousel-images", {
        method: "POST",
        body: JSON.stringify({ slides }),
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
