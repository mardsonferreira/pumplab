import { httpUtil } from "@/utils/common/http/client";

type ExportCarouselSlideInput = {
    index: number;
    image_url?: string;
    text: string;
    /** Base64-encoded PNG of the flattened slide (image + overlays). Takes precedence over image_url on the server. */
    flattened_image_base64?: string;
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
                ...(s.flattened_image_base64
                    ? { flattened_image_base64: s.flattened_image_base64 }
                    : {}),
            })),
        },
    });
}
