"use client";

import { useState, useCallback } from "react";
import { generateNarratives, generateCarouselMasterPrompt, generateCarouselImages } from "@/utils/api/openai";
import { parseCarousel } from "@/utils/parseNarratives";
import { Carousel, CarouselPromptObject, Narrative } from "@/types";
import { narrativePrompt, carouselMasterPrompt } from "./prompt";
import { BackendUnavailableError } from "@/lib/api/client";

export function useGenerateNarrative() {
    const [generating, setGenerating] = useState(false);
    const [narratives, setNarratives] = useState<Narrative[]>([]);
    const [error, setError] = useState<string | null>(null);

    const generateNarrative = useCallback(
        async (inputText: string) => {
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
        },
        [narrativePrompt],
    );

    return {
        generateNarrative,
        generating,
        narratives,
        error,
    };
}

export function useGenerateCarousel() {
    const [generating, setGenerating] = useState(false);
    const [carousel, setCarousel] = useState<Carousel>({} as Carousel);
    const [error, setError] = useState<string | null>(null);

    const generateCarousel = useCallback(
        async (narrative: Narrative) => {
            setGenerating(true);
            setCarousel({} as Carousel);
            setError(null);

            try {
                const prompt = carouselMasterPrompt.replace("{{NARRATIVE}}", JSON.stringify(narrative));
                const content = await generateCarouselMasterPrompt(prompt);
                const carouselPromptObject = parseCarousel(content);

                if (!carouselPromptObject?.slides || !Array.isArray(carouselPromptObject.slides)) {
                    console.error("Invalid carousel prompt object or missing slides:", carouselPromptObject);
                    setCarousel({ images_url: [] });
                    return;
                }

                const imagesUrl = await generateCarouselImages(carouselPromptObject.slides);
                setCarousel({
                    images_url: imagesUrl,
                });
            } catch (err) {
                console.error("Error generating carousel:", err);
                setCarousel({ images_url: [] });
                setError(
                    err instanceof BackendUnavailableError
                        ? err.message
                        : err instanceof Error
                          ? err.message
                          : "Erro ao gerar carrossel. Tente novamente.",
                );
            } finally {
                setGenerating(false);
            }
        },
        [carouselMasterPrompt],
    );

    return {
        generateCarousel,
        generating,
        carousel,
        error,
    };
}
