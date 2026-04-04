import { describe, it, expect, vi } from "vitest";
import { overlayReducer } from "./state";
import { createTextOverlay, createShapeOverlay } from "./factories";
import { SLIDE_WIDTH, SLIDE_HEIGHT, MAX_OVERLAYS_PER_SLIDE } from "./constants";
import type { OverlayElement, CarouselSlideEditState } from "@/types";

function mockSlideEdit(overlays: OverlayElement[] = []): CarouselSlideEditState {
    return {
        slideIndex: 1,
        baseImageUrl: "https://example.com/img.png",
        overlays,
        selectedOverlayId: null,
        imageStatus: "success",
        imageErrorMessage: null,
    };
}

describe("Drag bounds clamping via reducer", () => {
    it("clamps move to keep element within slide bounds", () => {
        const text = createTextOverlay("Test", 0, { x: 0, y: 0, width: 200, height: 100 });
        const overlays = [text];

        // Move way past right edge
        const next = overlayReducer(overlays, {
            type: "MOVE",
            id: text.id,
            x: SLIDE_WIDTH + 100,
            y: SLIDE_HEIGHT + 100,
            containerW: SLIDE_WIDTH,
            containerH: SLIDE_HEIGHT,
        });

        expect(next[0].x).toBe(SLIDE_WIDTH - 200);
        expect(next[0].y).toBe(SLIDE_HEIGHT - 100);
    });

    it("clamps negative positions to zero", () => {
        const text = createTextOverlay("Test", 0, { x: 100, y: 100, width: 200, height: 100 });
        const overlays = [text];

        const next = overlayReducer(overlays, {
            type: "MOVE",
            id: text.id,
            x: -500,
            y: -500,
            containerW: SLIDE_WIDTH,
            containerH: SLIDE_HEIGHT,
        });

        expect(next[0].x).toBe(0);
        expect(next[0].y).toBe(0);
    });
});

describe("Slide navigation persistence (per-slide independence)", () => {
    it("editing one slide's overlays does not affect another slide's state", () => {
        const slide1 = mockSlideEdit([createTextOverlay("Slide 1", 0)]);
        const slide2 = mockSlideEdit([createTextOverlay("Slide 2", 0)]);

        // Modify slide 1
        const updated1 = overlayReducer(slide1.overlays, {
            type: "UPDATE_TEXT",
            id: slide1.overlays[0].id,
            patch: { text: "Modified" },
        });

        // Slide 2 remains unchanged
        expect(slide2.overlays[0].kind).toBe("text");
        if (slide2.overlays[0].kind === "text") {
            expect(slide2.overlays[0].text).toBe("Slide 2");
        }
        if (updated1[0].kind === "text") {
            expect(updated1[0].text).toBe("Modified");
        }
    });

    it("adding overlays to one slide does not affect another", () => {
        const slide1Overlays = [createTextOverlay("A", 0)];
        const slide2Overlays = [createTextOverlay("B", 0)];

        const newText = createTextOverlay("New", 1);
        const updated1 = overlayReducer(slide1Overlays, { type: "ADD_OVERLAY", overlay: newText });

        expect(updated1).toHaveLength(2);
        expect(slide2Overlays).toHaveLength(1);
    });
});

describe("Max element limits", () => {
    it("blocks adding beyond MAX_OVERLAYS_PER_SLIDE", () => {
        const overlays: OverlayElement[] = [];
        let current = overlays;

        for (let i = 0; i < MAX_OVERLAYS_PER_SLIDE + 5; i++) {
            const el = i % 2 === 0
                ? createTextOverlay(`Text ${i}`, i)
                : createShapeOverlay("rectangle", 0);
            current = overlayReducer(current, { type: "ADD_OVERLAY", overlay: el });
        }

        expect(current).toHaveLength(MAX_OVERLAYS_PER_SLIDE);
    });

    it("allows adding after deleting when at limit", () => {
        let current: OverlayElement[] = [];

        for (let i = 0; i < MAX_OVERLAYS_PER_SLIDE; i++) {
            current = overlayReducer(current, {
                type: "ADD_OVERLAY",
                overlay: createTextOverlay(`T${i}`, i),
            });
        }
        expect(current).toHaveLength(MAX_OVERLAYS_PER_SLIDE);

        // Delete one
        current = overlayReducer(current, { type: "DELETE_OVERLAY", id: current[0].id });
        expect(current).toHaveLength(MAX_OVERLAYS_PER_SLIDE - 1);

        // Now can add again
        current = overlayReducer(current, {
            type: "ADD_OVERLAY",
            overlay: createTextOverlay("New", 100),
        });
        expect(current).toHaveLength(MAX_OVERLAYS_PER_SLIDE);
    });
});

describe("Shape defaults behind text", () => {
    it("new shapes get zIndex below existing text overlays", () => {
        const text = createTextOverlay("Text", 0);
        const shape = createShapeOverlay("rectangle", text.zIndex);

        // Shape should have a lower zIndex than text
        expect(shape.zIndex).toBeLessThan(text.zIndex);
    });
});
