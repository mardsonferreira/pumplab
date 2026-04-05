import { describe, it, expect } from "vitest";
import { computeTextFit, wrapText } from "./text-fit";

/**
 * happy-dom does not support Canvas 2D context, so computeTextFit
 * falls back to returning the requested size with overflow "none".
 * We test that fallback behavior here. The algorithm's real measurement
 * logic is validated at integration/browser level.
 */

describe("computeTextFit", () => {
    it("returns requested font size when canvas context is unavailable (happy-dom fallback)", () => {
        const result = computeTextFit("Hi", 24, 300, 200, 1.3);
        expect(result.fontSize).toBe(24);
        expect(result.overflow).toBe("none");
    });

    it("handles empty text gracefully", () => {
        const result = computeTextFit("", 24, 300, 200, 1.3);
        expect(result.fontSize).toBe(24);
        expect(result.overflow).toBe("none");
    });

    it("handles single character", () => {
        const result = computeTextFit("A", 24, 300, 200, 1.3);
        expect(result.fontSize).toBe(24);
        expect(result.overflow).toBe("none");
    });

    it("accepts large font sizes without error", () => {
        const result = computeTextFit("Test", 72, 1024, 1024, 1.3);
        expect(result.fontSize).toBe(72);
    });
});

describe("wrapText", () => {
    /**
     * Since happy-dom doesn't provide a real Canvas 2D context,
     * we test wrapText with a mock context that has measureText.
     */
    function mockCtx(charWidth: number): CanvasRenderingContext2D {
        return {
            measureText: (text: string) => ({ width: text.length * charWidth }),
        } as unknown as CanvasRenderingContext2D;
    }

    it("keeps short text on single line", () => {
        const ctx = mockCtx(8);
        const lines = wrapText(ctx, "Hello World", 1000);
        expect(lines).toEqual(["Hello World"]);
    });

    it("wraps text when it exceeds maxWidth", () => {
        const ctx = mockCtx(10);
        // "Hello World" = 11 chars * 10 = 110px, maxWidth = 60
        const lines = wrapText(ctx, "Hello World", 60);
        expect(lines.length).toBe(2);
        expect(lines[0]).toBe("Hello");
        expect(lines[1]).toBe("World");
    });

    it("preserves newlines in input", () => {
        const ctx = mockCtx(8);
        const lines = wrapText(ctx, "Line1\nLine2\nLine3", 1000);
        expect(lines.length).toBe(3);
        expect(lines[0]).toBe("Line1");
        expect(lines[1]).toBe("Line2");
        expect(lines[2]).toBe("Line3");
    });

    it("handles empty string", () => {
        const ctx = mockCtx(8);
        const lines = wrapText(ctx, "", 1000);
        expect(lines).toEqual([""]);
    });

    it("wraps multiple words correctly", () => {
        const ctx = mockCtx(10);
        // "A BB CCC" with maxWidth = 40 (4 chars)
        const lines = wrapText(ctx, "A BB CCC", 40);
        expect(lines.length).toBeGreaterThanOrEqual(2);
    });
});
