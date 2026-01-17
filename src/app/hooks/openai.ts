"use client";

import { useState, useCallback } from "react";
import { generateNarratives, generateCarouselMasterPrompt, generateCarouselImages } from "@/utils/api/openai";
import { parseCarousel, parseNarratives } from "@/utils/parseNarratives";
import { Carousel, CarouselPromptObject, Narrative } from "@/types";
import { narrativePrompt, carouselMasterPrompt } from "./prompt";

export function useGenerateNarrative() {
    const [generating, setGenerating] = useState(false);
    const [narratives, setNarratives] = useState<Narrative[]>([]);

    const generateNarrative = useCallback(async (inputText: string) => {
        setGenerating(true);
        setNarratives([]);

        try {
            const prompt = narrativePrompt.replace("{{THEME}}", inputText);
            const content = await generateNarratives(prompt);
            setNarratives(parseNarratives(content));

        } catch (err) {
            console.error(err);
            setNarratives([]);
        } finally {
            setGenerating(false);
        }
    }, [narrativePrompt]);

    return {
        generateNarrative,
        generating,
        narratives,
    };
}

export function useGenerateCarousel() {
    const [generating, setGenerating] = useState(false);
    const [carousel, setCarousel] = useState<Carousel>({} as Carousel);

    const generateCarousel = useCallback(async (narrative: Narrative) => {
        setGenerating(true);
        setCarousel({} as Carousel);

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
            console.log("imagesUrl", imagesUrl);
            setCarousel({
                images_url: imagesUrl,
            });
        } catch (err) {
            console.error("Error generating carousel:", err);
            setCarousel({ images_url: [] });
        } finally {
            setGenerating(false);
        }
    }, [carouselMasterPrompt]);

    return {
        generateCarousel,
        generating,
        carousel,
    };
}
