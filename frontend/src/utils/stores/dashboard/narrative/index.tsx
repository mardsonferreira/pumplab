import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { Narrative, PostPreview } from "@/types";

interface NarrativeStore {
    narrative: Narrative | null;
    setNarrative: (narrative: Narrative) => void;
    postPreview: PostPreview | null;
    setPostPreview: (preview: PostPreview | null) => void;
    clearPostPreview: () => void;
}

const INITIAL_STATE = {
    narrative: null,
    postPreview: null,
};

export const useNarrativeStore = create<NarrativeStore>()(
    devtools(
        persist(
            set => ({
                ...INITIAL_STATE,
                setNarrative: narrative =>
                    set({ narrative, postPreview: null }),
                setPostPreview: postPreview => set({ postPreview }),
                clearPostPreview: () => set({ postPreview: null }),
                reset: () => set(INITIAL_STATE),
            }),
            {
                name: "dashboard-narrative",
                storage: createJSONStorage(() => localStorage),
                skipHydration: false,
            },
        ),
    ),
);
