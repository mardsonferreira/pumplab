import { httpUtil } from "@/utils/common/http/client";

import type { CarouselPromptObject } from "@/types";

export async function generateCarouselMasterPrompt(
    prompt: string
): Promise<CarouselPromptObject> {
    const response = await httpUtil.post<CarouselPromptObject>("/openai/carousel-master-prompt", {
        body: { prompt },
    });
    return response ?? {};
}