import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type {
    Narrative,
    PostPreview,
    OverlaySessionState,
    TextOverlay,
    CarouselSlideEditState,
} from "@/types";

interface NarrativeStore {
    narrative: Narrative | null;
    setNarrative: (narrative: Narrative) => void;
    postPreview: PostPreview | null;
    setPostPreview: (preview: PostPreview | null) => void;
    clearPostPreview: () => void;

    // Overlay session helpers
    initOverlaySession: (session: OverlaySessionState) => void;
    setActiveSlide: (index: number) => void;
    updateSlideOverlays: (slideIndex: number, overlays: TextOverlay[]) => void;
    setSelectedOverlay: (slideIndex: number, overlayId: string | null) => void;
    getActiveSlideEdit: () => CarouselSlideEditState | null;
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

                initOverlaySession: (session: OverlaySessionState) => {
                    const pp = get().postPreview;
                    if (!pp) return;
                    set({ postPreview: { ...pp, overlaySession: session } });
                },

                setActiveSlide: (index: number) => {
                    const pp = get().postPreview;
                    if (!pp?.overlaySession) return;
                    set({
                        postPreview: {
                            ...pp,
                            overlaySession: { ...pp.overlaySession, activeSlideIndex: index },
                        },
                    });
                },

                updateSlideOverlays: (slideIndex: number, overlays: TextOverlay[]) => {
                    const pp = get().postPreview;
                    if (!pp?.overlaySession) return;
                    const prev = pp.overlaySession.slides[slideIndex];
                    if (!prev) return;
                    set({
                        postPreview: {
                            ...pp,
                            overlaySession: {
                                ...pp.overlaySession,
                                slides: {
                                    ...pp.overlaySession.slides,
                                    [slideIndex]: { ...prev, overlays },
                                },
                            },
                        },
                    });
                },

                setSelectedOverlay: (slideIndex: number, overlayId: string | null) => {
                    const pp = get().postPreview;
                    if (!pp?.overlaySession) return;
                    const prev = pp.overlaySession.slides[slideIndex];
                    if (!prev) return;
                    set({
                        postPreview: {
                            ...pp,
                            overlaySession: {
                                ...pp.overlaySession,
                                slides: {
                                    ...pp.overlaySession.slides,
                                    [slideIndex]: { ...prev, selectedOverlayId: overlayId },
                                },
                            },
                        },
                    });
                },

                getActiveSlideEdit: () => {
                    const pp = get().postPreview;
                    if (!pp?.overlaySession) return null;
                    return pp.overlaySession.slides[pp.overlaySession.activeSlideIndex] ?? null;
                },
            }),
            {
                name: "dashboard-narrative",
                storage: createJSONStorage(() => localStorage),
                skipHydration: false,
                // Exclude overlaySession from persistence — session-scoped only
                partialize: (state) => ({
                    narrative: state.narrative,
                    postPreview: state.postPreview
                        ? { ...state.postPreview, overlaySession: undefined }
                        : null,
                }),
            },
        ),
    ),
);
