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


export type SubscriptionWithPlan = {
    status: string;
    started_at: string;
    plan: {
      name: string;
      price: number;
      monthly_narratives: number;
    };
  };

export type Plan = {
    id: string;
    name: string;
    price: number;
    billing_cycle: string | null;
    monthly_narratives: number;
    description: string | null;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
};