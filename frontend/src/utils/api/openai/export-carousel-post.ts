import { httpUtil } from "@/utils/common/http/client";

type ExportCarouselSlideInput = {
    index: number;
    image_url?: string;
    text: string;
};

export async function exportCarouselPost(
    caption: string,
    slides: ExportCarouselSlideInput[]
): Promise<Blob> {
    return httpUtil.postBlob("/openai/carousel-export", {
        body: {
            caption,
            slides: slides.map(s => ({
                index: s.index,
                image_url: s.image_url ?? "",
                text: s.text,
            })),
        },
    });
}
