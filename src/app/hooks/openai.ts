"use client";

import { useState, useCallback } from "react";
import { generateNarratives } from "@/utils/api/openai";
import { parseNarratives } from "@/utils/parseNarratives";

type Narrative = {
    id: string;
    theme: string;
    central_thesis: string;
    main_argument: string;
    narrative_sequence: {
        step: number;
        title: string;
        description: string;
    }[];
}

export function useGenerateNarrative() {
    const promptTemplate = process.env.NEXT_PUBLIC_NARRATIVE_PROMPT || "";
    const [generating, setGenerating] = useState(false);
    const [narratives, setNarratives] = useState<Narrative[]>([]);

    const generateNarrative = useCallback(async (inputText: string) => {
        setGenerating(true);
        setNarratives([]);

        try {
            const prompt = promptTemplate.replace("{{THEME}}", inputText);
            const content = await generateNarratives(prompt);
            setNarratives(parseNarratives(content));

        } catch (err) {
            console.error(err);
            setNarratives([]);
        } finally {
            setGenerating(false);
        }
    }, [promptTemplate]);

    return {
        generateNarrative,
        generating,
        narratives,
    };
}