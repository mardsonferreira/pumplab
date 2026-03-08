import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { Narrative } from "@/types";

interface NarrativeStore {
    narrative: Narrative | null;
    setNarrative: (narrative: Narrative) => void;
}

const INITIAL_STATE = {
    narrative: null,
};

export const useNarrativeStore = create<NarrativeStore>()(
    devtools(
        persist(
            set => ({
                ...INITIAL_STATE,
                setNarrative: narrative => set({ narrative }),
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
