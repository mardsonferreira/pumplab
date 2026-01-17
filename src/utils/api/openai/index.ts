"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateNarratives(prompt: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
    });

    return response.choices[0].message.content ?? "";
}

export async function generateCarouselMasterPrompt(prompt: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
    });

    return response.choices[0].message.content ?? "";
}

export async function generateCarouselImages(slides: any[]) {
    try {
        const imageUrls: string[] = [];

        for (let i = 0; i < slides.length; i++) {
            try {
                const image = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: slides[i].image_prompt,
                    size: "1024x1024",
                    response_format: "url"
                });

                const url = image?.data?.[0]?.url ?? "";
                if (url) {
                    imageUrls.push(url);
                    console.log(`Generated image URL for slide ${i + 1}:`, url);
                }
            } catch (error) {
                console.error(`Error generating image for slide ${i + 1}:`, error);
            }
        }

        return imageUrls;
    } catch (error) {
        console.error("Error generating carousel images:", error);
        return [];
    }
}