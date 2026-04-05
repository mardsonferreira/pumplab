import type { TextOverlay } from "@/types";

export type TextUpdatePatch = Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>;
