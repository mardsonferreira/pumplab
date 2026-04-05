"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FiArrowLeft, FiDownload, FiHeart, FiRefreshCw, FiPlus } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";

import { Carousel } from "@/components/common/carousel";
import { Button } from "@/components/ui/Button";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";
import { useGenerateCarousel } from "@/app/hooks/openai";
import { exportCarouselPost } from "@/utils/api/openai/export-carousel-post";
import {
    OverlayCanvas,
    flattenSlide,
    overlayReducer,
    createTextOverlay,
    computeTextFit,
    canAddOverlay,
    defaultFontSizeForViewport,
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
} from "./overlay-editor";
import type { CarouselSlide as CarouselSlideType, TextOverlay } from "@/types";

export function Post() {
    const {
        postPreview,
        setActiveSlide,
        updateSlideOverlays,
        setSelectedOverlay,
    } = useNarrativeStore();
    const { retryFailedSlides, retrying, error } = useGenerateCarousel();
    const [exportError, setExportError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);
    const router = useRouter();
    const hasFailedSlides =
        postPreview?.slides?.some(s => s.status === "failed") ?? false;

    const session = postPreview?.overlaySession;
    const activeSlideEdit = session
        ? session.slides[session.activeSlideIndex] ?? null
        : null;

    // --- Overlay actions ---

    const handleSlideChange = useCallback(
        (index: number) => setActiveSlide(index),
        [setActiveSlide],
    );

    const dispatchOverlay = useCallback(
        (action: Parameters<typeof overlayReducer>[1]) => {
            if (!activeSlideEdit || !session) return;
            const next = overlayReducer(activeSlideEdit.overlays, action);
            updateSlideOverlays(session.activeSlideIndex, next);
        },
        [activeSlideEdit, session, updateSlideOverlays],
    );

    const handleSelectOverlay = useCallback(
        (id: string | null) => {
            if (!session) return;
            setSelectedOverlay(session.activeSlideIndex, id);
        },
        [session, setSelectedOverlay],
    );

    const handleMove = useCallback(
        (id: string, x: number, y: number) => {
            dispatchOverlay({ type: "MOVE", id, x, y, containerW: SLIDE_WIDTH, containerH: SLIDE_HEIGHT });
        },
        [dispatchOverlay],
    );

    const handleResize = useCallback(
        (id: string, x: number, y: number, width: number, height: number) => {
            const el = activeSlideEdit?.overlays.find(o => o.id === id);
            if (!el) return;
            const { overflow } = computeTextFit(el.text, el.fontSize, width, height, el.lineHeight);
            dispatchOverlay({
                type: "RESIZE",
                id,
                x,
                y,
                width,
                height,
                overflow,
                containerW: SLIDE_WIDTH,
                containerH: SLIDE_HEIGHT,
            });
        },
        [dispatchOverlay, activeSlideEdit],
    );

    const handleAddText = useCallback(() => {
        if (!activeSlideEdit) return;
        const maxZ = activeSlideEdit.overlays.reduce((m, o) => Math.max(m, o.zIndex), 0);
        const overlay = createTextOverlay("Novo texto", maxZ, { fontSize: defaultFontSizeForViewport() });
        dispatchOverlay({ type: "ADD_OVERLAY", overlay });
        if (session) setSelectedOverlay(session.activeSlideIndex, overlay.id);
    }, [activeSlideEdit, dispatchOverlay, session, setSelectedOverlay]);

    const handleDeleteOverlay = useCallback(
        (id: string) => {
            dispatchOverlay({ type: "DELETE_OVERLAY", id });
            handleSelectOverlay(null);
        },
        [dispatchOverlay, handleSelectOverlay],
    );

    const handleUpdateText = useCallback(
        (id: string, patch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color">>) => {
            let fullPatch: Partial<Pick<TextOverlay, "text" | "fontSize" | "color" | "overflow">> = { ...patch };
            if (patch.text !== undefined || patch.fontSize !== undefined) {
                const el = activeSlideEdit?.overlays.find(o => o.id === id);
                if (el) {
                    const text = patch.text ?? el.text;
                    const fontSize = patch.fontSize ?? el.fontSize;
                    const { overflow } = computeTextFit(text, fontSize, el.width, el.height, el.lineHeight);
                    fullPatch = { ...fullPatch, overflow };
                }
            }
            dispatchOverlay({ type: "UPDATE_TEXT", id, patch: fullPatch });
        },
        [dispatchOverlay, activeSlideEdit],
    );

    // --- Export ---

    const handleDownloadPost = useCallback(async () => {
        if (!postPreview?.caption || !postPreview?.slides?.length) return;
        setExportError(null);
        setExporting(true);
        try {
            // Flatten overlays onto each slide image for WYSIWYG export
            const flattenedMap: Record<number, string> = {};
            if (session) {
                for (const s of postPreview.slides) {
                    const slideEdit = session.slides[s.index];
                    if (slideEdit && slideEdit.overlays.length > 0) {
                        try {
                            flattenedMap[s.index] = await flattenSlide(slideEdit);
                        } catch {
                            // Fallback to image_url if flattening fails
                        }
                    }
                }
            }

            const blob = await exportCarouselPost(
                postPreview.caption,
                postPreview.slides.map(s => ({
                    index: s.index,
                    image_url: s.image_url,
                    text: s.text,
                    flattened_image_base64: flattenedMap[s.index],
                })),
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `instagram_post_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "").replace(" ", "_")}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            router.push("/dashboard");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Falha ao baixar o post.";
            setExportError(
                message.includes("fetch") || message.includes("indisponível")
                    ? "Serviço temporariamente indisponível. Tente clicar em Baixar Post novamente em instantes."
                    : `${message} Você pode tentar novamente sem regenerar o carrossel.`,
            );
        } finally {
            setExporting(false);
        }
    }, [postPreview, session, router]);

    // --- Render ---

    const caption = postPreview?.caption ?? "";
    const slides = postPreview?.slides ?? undefined;
    const readyToDownload = postPreview?.ready_to_download ?? false;

    /**
     * Renders the overlay canvas for each slide inside the carousel.
     * The floating toolbar is a sibling of the canvas (not inside overflow-hidden),
     * so it can render outside the canvas bounds without being clipped.
     */
    const renderSlide = useCallback(
        (slide: CarouselSlideType, _idx: number) => {
            const slideEdit = session?.slides[slide.index];
            if (!slideEdit) return null;
            const isActiveSlide = session?.activeSlideIndex === slide.index;
            return (
                <div className="relative w-full">
                    <OverlayCanvas
                        slide={slideEdit}
                        isActive={isActiveSlide}
                        onSelect={handleSelectOverlay}
                        onMove={handleMove}
                        onUpdateText={handleUpdateText}
                        onResize={handleResize}
                        onDeleteOverlay={handleDeleteOverlay}
                    />
                </div>
            );
        },
        [session, handleSelectOverlay, handleMove, handleResize, handleUpdateText, handleDeleteOverlay],
    );

    return (
        <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-2xl">
                <Link href="/narrative/edit" className="text-primary mb-8 inline-flex items-center">
                    <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                        <FiArrowLeft size={16} />
                    </span>
                    Voltar
                </Link>

                <div className="mb-4 text-center">
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                        Preview do seu conteúdo no Instagram
                    </h3>
                </div>

                <div className="bg-foreground/5 border-foreground/10 overflow-hidden rounded-md border shadow-2xl backdrop-blur-sm">
                    <div className="bg-background">
                        {session ? (
                            <Carousel
                                slides={slides}
                                onSlideChange={handleSlideChange}
                                renderSlide={renderSlide}
                            />
                        ) : (
                            <Carousel slides={slides} />
                        )}
                    </div>

                    {/* Add text button — bottom-left, just below the carousel */}
                    {activeSlideEdit && (
                        <div className="border-t border-foreground/10 bg-background px-4 py-2">
                            <button
                                type="button"
                                disabled={!canAddOverlay(activeSlideEdit.overlays.length)}
                                onClick={handleAddText}
                                title={
                                    canAddOverlay(activeSlideEdit.overlays.length)
                                        ? "Adicionar caixa de texto"
                                        : "Limite de 10 elementos atingido"
                                }
                                className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-sm text-primary hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
                            >
                                <FiPlus size={16} />
                                Adicionar texto
                            </button>
                        </div>
                    )}

                    <div className="space-y-6 px-4 py-6 sm:px-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm font-semibold uppercase text-primary">
                                    <span className="inline-flex h-4 w-4 items-center justify-center">
                                        <FiHeart size={16} />
                                    </span>
                                    <span>8.5k</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-semibold uppercase text-primary">
                                    <span className="inline-flex h-4 w-4 items-center justify-center">
                                        <FaRegComment size={16} />
                                    </span>
                                    <span>256</span>
                                </div>
                            </div>
                            <p className="text-foreground/90 text-base leading-relaxed">
                                {caption ||
                                    "Gere um carrossel na etapa anterior para ver o preview e a legenda aqui."}
                            </p>
                        </div>

                        {(error || exportError) && (
                            <p className="text-center text-sm text-destructive" role="alert">
                                {exportError ?? error}
                            </p>
                        )}

                        <div className="border-foreground/10 border-t" />

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            {hasFailedSlides && (
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full px-6 py-3 sm:w-auto"
                                    onClick={retryFailedSlides}
                                    disabled={retrying}
                                >
                                    <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                                        <FiRefreshCw
                                            size={16}
                                            className={retrying ? "animate-spin" : ""}
                                        />
                                    </span>
                                    Tentar novamente (slides com falha)
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                type="button"
                                className="w-full px-8 py-4 text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
                                onClick={handleDownloadPost}
                                disabled={!readyToDownload || exporting}
                            >
                                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                                    <FiDownload size={20} />
                                </span>
                                {exporting ? "Preparando download…" : "Baixar Post"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-foreground/50 text-xs">
                        {readyToDownload
                            ? "O conteúdo será baixado em alta qualidade"
                            : "Complete a geração do carrossel para habilitar o download."}
                    </p>
                </div>
            </div>
        </div>
    );
}
