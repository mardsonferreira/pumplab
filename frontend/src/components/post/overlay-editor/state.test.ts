import { describe, it, expect } from "vitest";
import { overlayReducer } from "./state";
import { createTextOverlay } from "./factories";
import { MAX_OVERLAYS_PER_SLIDE, MIN_OVERLAY_HEIGHT, MIN_OVERLAY_WIDTH } from "./constants";
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

    it("resizes overlay within container bounds", () => {
        const overlays = [{ ...makeText("t1"), x: 100, y: 100, width: 200, height: 80 }];
        const next = overlayReducer(overlays, {
            type: "RESIZE",
            id: "t1",
            x: 50,
            y: 50,
            width: 400,
            height: 200,
            overflow: "none",
            containerW: 500,
            containerH: 500,
        });
        expect(next[0]).toMatchObject({
            x: 50,
            y: 50,
            width: 400,
            height: 200,
            overflow: "none",
        });
    });

    it("clamps resize to minimum size and caps dimensions to container", () => {
        const overlays = [{ ...makeText("t1"), x: 10, y: 10, width: 200, height: 100 }];
        const next = overlayReducer(overlays, {
            type: "RESIZE",
            id: "t1",
            x: 10,
            y: 10,
            width: 20,
            height: 15,
            overflow: "warning",
            containerW: 500,
            containerH: 500,
        });
        expect(next[0].width).toBe(MIN_OVERLAY_WIDTH);
        expect(next[0].height).toBe(MIN_OVERLAY_HEIGHT);
        expect(next[0].overflow).toBe("warning");
    });

    it("caps width and height to container on resize", () => {
        const overlays = [{ ...makeText("t1"), x: 0, y: 0, width: 100, height: 50 }];
        const next = overlayReducer(overlays, {
            type: "RESIZE",
            id: "t1",
            x: 0,
            y: 0,
            width: 800,
            height: 800,
            overflow: "none",
            containerW: 500,
            containerH: 400,
        });
        expect(next[0].width).toBe(500);
        expect(next[0].height).toBe(400);
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
