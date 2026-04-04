import { describe, it, expect } from "vitest";
import { overlayReducer, type OverlayAction } from "./state";
import { createTextOverlay, createShapeOverlay } from "./factories";
import { MAX_OVERLAYS_PER_SLIDE } from "./constants";
import type { OverlayElement } from "@/types";

function makeText(id: string, z = 1): OverlayElement {
    return { ...createTextOverlay("hello", z - 1), id, zIndex: z };
}

function makeShape(id: string, z = 0): OverlayElement {
    return { ...createShapeOverlay("rectangle", z + 1), id, zIndex: z };
}

describe("overlayReducer", () => {
    // ---- ADD ----
    it("adds an overlay when under the limit", () => {
        const next = overlayReducer([], { type: "ADD_OVERLAY", overlay: makeText("t1") });
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe("t1");
    });

    it("rejects adding overlay when at max limit", () => {
        const full: OverlayElement[] = Array.from({ length: MAX_OVERLAYS_PER_SLIDE }, (_, i) =>
            makeText(`t${i}`, i),
        );
        const next = overlayReducer(full, { type: "ADD_OVERLAY", overlay: makeText("extra") });
        expect(next).toHaveLength(MAX_OVERLAYS_PER_SLIDE);
    });

    // ---- DELETE ----
    it("deletes an overlay by id", () => {
        const overlays = [makeText("t1"), makeText("t2")];
        const next = overlayReducer(overlays, { type: "DELETE_OVERLAY", id: "t1" });
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe("t2");
    });

    // ---- UPDATE TEXT ----
    it("updates text properties", () => {
        const overlays = [makeText("t1")];
        const next = overlayReducer(overlays, { type: "UPDATE_TEXT", id: "t1", patch: { text: "new", color: "#FF0000" } });
        expect(next[0].kind).toBe("text");
        if (next[0].kind === "text") {
            expect(next[0].text).toBe("new");
            expect(next[0].color).toBe("#FF0000");
        }
    });

    it("does not update shape when UPDATE_TEXT is dispatched", () => {
        const overlays = [makeShape("s1")];
        const next = overlayReducer(overlays, { type: "UPDATE_TEXT", id: "s1", patch: { text: "x" } });
        expect(next[0].kind).toBe("shape");
    });

    // ---- UPDATE SHAPE ----
    it("updates shape properties", () => {
        const overlays = [makeShape("s1")];
        const next = overlayReducer(overlays, { type: "UPDATE_SHAPE", id: "s1", patch: { opacity: 0.8, filled: false } });
        if (next[0].kind === "shape") {
            expect(next[0].opacity).toBe(0.8);
            expect(next[0].filled).toBe(false);
        }
    });

    // ---- MOVE ----
    it("moves overlay and clamps to bounds", () => {
        const overlays = [{ ...makeText("t1"), x: 0, y: 0, width: 100, height: 50 }];
        const next = overlayReducer(overlays, { type: "MOVE", id: "t1", x: 1000, y: 1000, containerW: 500, containerH: 500 });
        expect(next[0].x).toBe(400);  // 500 - 100
        expect(next[0].y).toBe(450);  // 500 - 50
    });

    it("clamps negative positions to zero", () => {
        const overlays = [{ ...makeText("t1"), x: 50, y: 50, width: 100, height: 50 }];
        const next = overlayReducer(overlays, { type: "MOVE", id: "t1", x: -50, y: -50, containerW: 500, containerH: 500 });
        expect(next[0].x).toBe(0);
        expect(next[0].y).toBe(0);
    });

    // ---- RESIZE ----
    it("resizes overlay with minimum dimensions", () => {
        const overlays = [makeText("t1")];
        const next = overlayReducer(overlays, { type: "RESIZE", id: "t1", width: 5, height: 10 });
        expect(next[0].width).toBe(20);  // clamped to min 20
        expect(next[0].height).toBe(20);
    });

    // ---- LAYER ORDER ----
    it("brings overlay forward (swaps zIndex with next)", () => {
        const overlays = [
            { ...makeText("t1"), zIndex: 1 },
            { ...makeText("t2"), zIndex: 2 },
        ];
        const next = overlayReducer(overlays, { type: "BRING_FORWARD", id: "t1" });
        const t1 = next.find(o => o.id === "t1")!;
        const t2 = next.find(o => o.id === "t2")!;
        expect(t1.zIndex).toBe(2);
        expect(t2.zIndex).toBe(1);
    });

    it("sends overlay backward (swaps zIndex with prev)", () => {
        const overlays = [
            { ...makeText("t1"), zIndex: 1 },
            { ...makeText("t2"), zIndex: 2 },
        ];
        const next = overlayReducer(overlays, { type: "SEND_BACKWARD", id: "t2" });
        const t1 = next.find(o => o.id === "t1")!;
        const t2 = next.find(o => o.id === "t2")!;
        expect(t1.zIndex).toBe(2);
        expect(t2.zIndex).toBe(1);
    });

    it("does nothing when bringing topmost forward", () => {
        const overlays = [
            { ...makeText("t1"), zIndex: 1 },
            { ...makeText("t2"), zIndex: 2 },
        ];
        const next = overlayReducer(overlays, { type: "BRING_FORWARD", id: "t2" });
        expect(next.find(o => o.id === "t2")!.zIndex).toBe(2);
    });

    // ---- SET_OVERLAYS ----
    it("replaces all overlays with SET_OVERLAYS", () => {
        const overlays = [makeText("t1"), makeText("t2")];
        const replacement = [makeShape("s1")];
        const next = overlayReducer(overlays, { type: "SET_OVERLAYS", overlays: replacement });
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe("s1");
    });

    // ---- Per-slide independence (conceptual) ----
    it("actions on one overlays array do not mutate another", () => {
        const slide1 = [makeText("t1")];
        const slide2 = [makeText("t2")];
        overlayReducer(slide1, { type: "DELETE_OVERLAY", id: "t1" });
        expect(slide2).toHaveLength(1);
        expect(slide2[0].id).toBe("t2");
    });
});
