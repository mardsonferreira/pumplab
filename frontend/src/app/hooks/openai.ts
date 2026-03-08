"use client";

import { useState, useCallback } from "react";
import {
    generateNarratives,
    generateCarouselMasterPrompt,
    generateCarouselImages,
} from "@/utils/api/openai";
import type { CarouselSlide, Narrative, PostPreview } from "@/types";
import { narrativePrompt, carouselMasterPrompt, buildCarouselPromptFromDraft } from "./prompt";
import { BackendUnavailableError } from "@/lib/api/client";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";

function toCarouselSlide(
    item: { role: string; text: string; image_prompt: string },
    index: number,
    imageUrl?: string,
    status: CarouselSlide["status"] = "pending"
): CarouselSlide {
    const role = ["central_thesis", "argument", "sequence", "cta"].includes(item.role)
        ? (item.role as CarouselSlide["role"])
        : "sequence";
    return {
        index: index + 1,
        role,
        text: item.text,
        image_prompt: item.image_prompt,
        image_url: imageUrl,
        status,
        ...(status === "failed" && !imageUrl ? { error_message: "Falha ao gerar imagem." } : {}),
    };
}

export function useGenerateNarrative() {
    const [generating, setGenerating] = useState(false);
    const [narratives, setNarratives] = useState<Narrative[]>([]);
    const [error, setError] = useState<string | null>(null);

    const generateNarrative = useCallback(async (inputText: string) => {
        setGenerating(true);
        setNarratives([]);
        setError(null);
        try {
            const prompt = narrativePrompt.replace("{{THEME}}", inputText);
            const list = await generateNarratives(prompt);
            setNarratives(list);
        } catch (err) {
            console.error(err);
            setNarratives([]);
            setError(
                err instanceof BackendUnavailableError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Erro ao gerar narrativas. Tente novamente.",
            );
        } finally {
            setGenerating(false);
        }
    }, []);

    return { generateNarrative, generating, narratives, error };
}

export function useGenerateCarousel() {
    const [generating, setGenerating] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setPostPreview } = useNarrativeStore();

    const generateCarousel = useCallback(
        async (narrative: Narrative): Promise<boolean> => {
            setGenerating(true);
            setError(null);
            try {
                const promptText = carouselMasterPrompt.replace(
                    "{{NARRATIVE}}",
                    buildCarouselPromptFromDraft(narrative),
                );
                const master = await generateCarouselMasterPrompt(promptText);
                if (!master?.slides || master.slides.length !== 5 || !master.caption?.trim()) {
                    setError("Resposta do carrossel inválida. Tente novamente.");
                    return false;
                }
                const slidesPending = master.slides.map((s, i) =>
                    toCarouselSlide(s, i, undefined, "pending"),
                );
                const style = master.style
                    ? {
                          color_palette: master.style.color_palette ?? "",
                          visual_style: master.style.visual_style ?? "",
                      }
                    : undefined;
                setPostPreview({
                    slides: slidesPending,
                    caption: master.caption ?? "",
                    ready_to_download: false,
                    last_generation_at: new Date().toISOString(),
                    style,
                });
                const urls = await generateCarouselImages(
                    master.slides.map(s => ({
                        image_prompt: s.image_prompt,
                        text: s.text,
                        role: s.role,
                    })),
                    style,
                );
                const slides: CarouselSlide[] = slidesPending.map((s, i) => {
                    const url = urls[i];
                    const status = url ? "success" : "failed";
                    return {
                        ...s,
                        image_url: url || undefined,
                        status,
                        error_message: status === "failed" ? "Falha ao gerar imagem." : undefined,
                    };
                });
                const caption = master.caption ?? "";
                const ready_to_download =
                    slides.every(s => s.status === "success") && !!caption;
                setPostPreview({
                    slides,
                    caption,
                    ready_to_download,
                    last_generation_at: new Date().toISOString(),
                    style,
                });
                return true;
            } catch (err) {
                console.error("Error generating carousel:", err);
                setError(
                    err instanceof BackendUnavailableError
                        ? err.message
                        : err instanceof Error
                          ? err.message
                          : "Erro ao gerar carrossel. Tente novamente.",
                );
                return false;
            } finally {
                setGenerating(false);
            }
        },
        [setPostPreview],
    );

    const retryFailedSlides = useCallback(async () => {
        const { postPreview } = useNarrativeStore.getState();
        if (!postPreview?.slides?.length) return;
        const failed = postPreview.slides
            .map((s, i) => ({ slide: s, i }))
            .filter(({ slide }) => slide.status === "failed");
        if (failed.length === 0) return;
        const style = postPreview.style;
        setRetrying(true);
        setError(null);
        try {
            const toSend = failed.map(({ slide }) => ({
                image_prompt: slide.image_prompt,
                text: slide.text,
                role: slide.role,
            }));
            const urls = await generateCarouselImages(toSend, style);
            const updatedSlides = [...postPreview.slides];
            failed.forEach(({ slide, i }, idx) => {
                const url = urls[idx];
                const status = url ? "success" : "failed";
                const j = updatedSlides.findIndex(s => s.index === slide.index);
                if (j !== -1) {
                    updatedSlides[j] = {
                        ...updatedSlides[j],
                        image_url: url || undefined,
                        status,
                        error_message: status === "failed" ? "Falha ao gerar imagem." : undefined,
                    };
                }
            });
            const ready_to_download =
                updatedSlides.every(s => s.status === "success") && !!postPreview.caption;
            setPostPreview({
                slides: updatedSlides,
                caption: postPreview.caption,
                ready_to_download,
                last_generation_at: postPreview.last_generation_at,
                style,
            });
        } catch (err) {
            console.error("Error retrying slides:", err);
            setError(
                err instanceof BackendUnavailableError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Erro ao tentar novamente.",
            );
        } finally {
            setRetrying(false);
        }
    }, [setPostPreview]);

    return {
        generateCarousel,
        generating,
        retrying,
        retryFailedSlides,
        error,
    };
}
