import { httpUtil } from "@/utils/common/http/client";

type CarouselImageSlideInput = {
    image_prompt: string;
    text?: string;
    role?: string;
};

type GenerateCarouselImagesResponse = {
    urls: string[];
};

export async function generateCarouselImages(
    slides: CarouselImageSlideInput[],
    style?: { color_palette: string; visual_style: string }
): Promise<string[]> {
    const response = await httpUtil.post<GenerateCarouselImagesResponse>("/openai/carousel-images", {
        body: style ? { slides, style } : { slides },
    });
    return response.urls ?? [];
}
