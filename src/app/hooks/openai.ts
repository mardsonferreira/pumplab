"use client";

import { useState, useCallback } from "react";
import { generateNarratives } from "@/utils/api/openai";
import { parseNarratives } from "@/utils/parseNarratives";
import { Narrative } from "@/types";
import { narrativePrompt } from "./prompt";

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