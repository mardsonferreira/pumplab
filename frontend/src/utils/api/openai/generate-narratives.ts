import { httpUtil } from "@/utils/common/http/client";
import type { Narrative } from "@/types";

type GenerateNarrativesResponse = {
    narratives: Narrative[];
};

export async function generateNarratives(theme: string): Promise<Narrative[]> {
    const response = await httpUtil.post<GenerateNarrativesResponse>("/openai/narratives", {
        body: { theme },
    });
    return response.narratives ?? [];
}
