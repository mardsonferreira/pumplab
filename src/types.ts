export type Narrative = {
    id: string;
    theme: string;
    central_thesis: string;
    main_argument: string;
    narrative_sequence: {
        step: number;
        title: string;
        description: string;
    }[];
};

export type CarouselPromptObject = {
    style: {
        color_palette: string;
        visual_style: string;
    };
    slides: {
        role: string;
        text: string;
        image_prompt: string;
    }[];
};

export type Carousel = {
    images_url: string[];
};
