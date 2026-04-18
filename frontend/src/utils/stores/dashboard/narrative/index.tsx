import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { Narrative, PostPreview } from "@/types";

interface NarrativeStore {
    narrative: Narrative | null;
    setNarrative: (narrative: Narrative) => void;
    postPreview: PostPreview | null;
    setPostPreview: (preview: PostPreview | null) => void;
    clearPostPreview: () => void;

    /** Updates AI slide copy for one slide (1-based index). */
    updateSlideText: (slideIndex: number, text: string) => void;
}

const INITIAL_STATE = {
    narrative: null,
    postPreview: null,
};

export const useNarrativeStore = create<NarrativeStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...INITIAL_STATE,
                setNarrative: narrative =>
                    set({ narrative, postPreview: null }),
                setPostPreview: postPreview => set({ postPreview }),
                clearPostPreview: () => set({ postPreview: null }),
                reset: () => set(INITIAL_STATE),

                updateSlideText: (slideIndex: number, text: string) => {
                    const pp = get().postPreview;
                    if (!pp?.slides?.length) return;
                    set({
                        postPreview: {
                            ...pp,
                            slides: pp.slides.map(s =>
                                s.index === slideIndex ? { ...s, text } : s,
                            ),
                        },
                    });
                },
            }),
            {
                name: "dashboard-narrative",
                storage: createJSONStorage(() => localStorage),
                skipHydration: false,
                partialize: (state) => ({
                    narrative: state.narrative,
                    postPreview: state.postPreview,
                }),
            },
        ),
    ),
);
