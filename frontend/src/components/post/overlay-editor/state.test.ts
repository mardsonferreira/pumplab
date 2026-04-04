import { describe, it, expect } from "vitest";
import { overlayReducer } from "./state";
import { createTextOverlay } from "./factories";
import { MAX_OVERLAYS_PER_SLIDE } from "./constants";
import type { TextOverlay } from "@/types";

function makeText(id: string, z = 1): TextOverlay {
    return { ...createTextOverlay("hello", z - 1), id, zIndex: z };
}

describe("overlayReducer", () => {
    it("adds an overlay when under the limit", () => {
        const next = overlayReducer([], { type: "ADD_OVERLAY", overlay: makeText("t1") });
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe("t1");
    });

    it("rejects adding overlay when at max limit", () => {
        const full: TextOverlay[] = Array.from({ length: MAX_OVERLAYS_PER_SLIDE }, (_, i) =>
            makeText(`t${i}`, i),
        );
        const next = overlayReducer(full, { type: "ADD_OVERLAY", overlay: makeText("extra") });
        expect(next).toHaveLength(MAX_OVERLAYS_PER_SLIDE);
    });

    it("deletes an overlay by id", () => {
        const overlays = [makeText("t1"), makeText("t2")];
        const next = overlayReducer(overlays, { type: "DELETE_OVERLAY", id: "t1" });
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe("t2");
    });

    it("updates text properties", () => {
        const overlays = [makeText("t1")];
        const next = overlayReducer(overlays, {
            type: "UPDATE_TEXT",
            id: "t1",
            patch: { text: "new", color: "#FF0000" },
        });
        expect(next[0].text).toBe("new");
        expect(next[0].color).toBe("#FF0000");
    });

    it("moves overlay and clamps to bounds", () => {
        const overlays = [{ ...makeText("t1"), x: 0, y: 0, width: 100, height: 50 }];
        const next = overlayReducer(overlays, {
            type: "MOVE",
            id: "t1",
            x: 1000,
            y: 1000,
            containerW: 500,
            containerH: 500,
        });
        expect(next[0].x).toBe(400);
        expect(next[0].y).toBe(450);
    });

    it("clamps negative positions to zero", () => {
        const overlays = [{ ...makeText("t1"), x: 50, y: 50, width: 100, height: 50 }];
        const next = overlayReducer(overlays, {
            type: "MOVE",
            id: "t1",
            x: -50,
            y: -50,
            containerW: 500,
            containerH: 500,
        });
        expect(next[0].x).toBe(0);
        expect(next[0].y).toBe(0);
    });

    it("actions on one overlays array do not mutate another", () => {
        const slide1 = [makeText("t1")];
        const slide2 = [makeText("t2")];
        overlayReducer(slide1, { type: "DELETE_OVERLAY", id: "t1" });
        expect(slide2).toHaveLength(1);
        expect(slide2[0].id).toBe("t2");
    });
});
