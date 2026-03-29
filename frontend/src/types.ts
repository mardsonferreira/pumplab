export type Narrative = {
    id: string;
    theme: string;
    centralThesis: string;
    mainArgument: string;
    narrativeSequence: {
        step: number;
        title: string;
        description: string;
    }[];
};

/** Editable narrative state after user selects one option; caption required before export. */
export type NarrativeDraft = {
    centralThesis: string;
    mainArgument: string;
    narrativeSequence: { step: number; title: string; description: string }[];
    caption?: string;
};

export type CarouselSlideRole = "central_thesis" | "argument" | "sequence" | "cta";
export type CarouselSlideStatus = "pending" | "success" | "failed";

/** One slide of the generated carousel; image_url and status updated by generation/retry. */
export type CarouselSlide = {
    index: number;
    role: CarouselSlideRole;
    text: string;
    image_prompt: string;
    image_url?: string;
    status: CarouselSlideStatus;
    error_message?: string;
};

/** Preview state before download; ready_to_download only when all 5 slides success and caption present. */
export type PostPreview = {
    slides: CarouselSlide[];
    caption: string;
    ready_to_download: boolean;
    last_generation_at?: string;
    /** Global style from master for image retries. */
    style?: { color_palette: string; visual_style: string };
};

/** Shape after `httpUtil` camelCases the API JSON (snake_case in wire format). */
export type CarouselPromptObject = {
    style: {
        colorPalette: string;
        visualStyle: string;
    };
    caption: string;
    slides: {
        role: CarouselSlideRole;
        text: string;
        imagePrompt: string;
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

  // TODO: update the snake case to camel case

/** From Stripe: next billing date, card brand (e.g. visa), last 4 digits. */
export type SubscriptionPaymentInfo = {
  nextChargeAt: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
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

export interface Subscription {
    id: string;
    status: string;
    startedAt: string;
    endsAt: null;
    stripeSubscriptionId: string;
    nextChargeAt?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    plan: {
        id: string;
        name: string;
        price: number;
        billingCycle: string | null;
        monthlyNarratives: number;
        description: string | null;
        stripeProductId: string | null;
        stripePriceId: string | null;
    };
}