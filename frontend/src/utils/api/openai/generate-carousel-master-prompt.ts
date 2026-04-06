import { httpUtil } from "@/utils/common/http/client";

import type { CarouselPromptObject } from "@/types";

export type CarouselMasterNarrativeInput = {
    theme?: string;
    centralThesis: string;
    mainArgument: string;
    narrativeSequence: { step: number; title: string; description: string }[];
};

export async function generateCarouselMasterPrompt(
    input: CarouselMasterNarrativeInput,
): Promise<CarouselPromptObject> {
    const response = await httpUtil.post<CarouselPromptObject>("/openai/carousel-master-prompt", {
        body: {
            theme: input.theme,
            centralThesis: input.centralThesis,
            mainArgument: input.mainArgument,
            narrativeSequence: input.narrativeSequence,
        },
    });
    return response ?? {};
}
