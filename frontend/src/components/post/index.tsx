"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FiArrowLeft, FiDownload, FiHeart, FiRefreshCw } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";

import { Carousel } from "@/components/common/carousel";
import { Button } from "@/components/ui/Button";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";
import { useGenerateCarousel } from "@/app/hooks/openai";
import { exportCarouselPost } from "@/utils/api/openai/export-carousel-post";
import { cn } from "@/utils/cn";
import type { CarouselSlide as CarouselSlideType } from "@/types";

const SLIDE_COUNT = 5;

function SlideWithEditableText({
    slide,
    onTextChange,
}: {
    slide: CarouselSlideType;
    onTextChange: (slideIndex: number, text: string) => void;
}) {
    const textBlock = (
        <div
            className={cn(
                "border-t border-white/[0.06] bg-gradient-to-b from-background via-background to-slate-800/25",
                "pb-4 pt-5 sm:px-5",
            )}
        >
            <div className="mb-3 flex items-center justify-end">
                <span
                    className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary"
                    aria-hidden
                >
                    {slide.index}/{SLIDE_COUNT}
                </span>
            </div>
            <label htmlFor={`slide-text-${slide.index}`} className="sr-only">
                Editar texto do slide {slide.index}
            </label>
            <div
                className={cn(
                    "overflow-hidden rounded-2xl border border-neutral-800/90",
                    "bg-slate-900/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                    "ring-1 ring-white/[0.05] transition-[box-shadow,border-color] duration-200",
                    "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/35",
                )}
            >
                <textarea
                    id={`slide-text-${slide.index}`}
                    value={slide.text}
                    onChange={e => onTextChange(slide.index, e.target.value)}
                    rows={4}
                    spellCheck
                    className={cn(
                        "min-h-[6.25rem] w-full resize-y border-0 bg-transparent",
                        "px-4 py-3.5 text-[15px] leading-[1.55] text-foreground antialiased",
                        "placeholder:text-neutral-500",
                        "focus:outline-none",
                    )}
                    placeholder="Edite o texto gerado para este slide…"
                />
            </div>
        </div>
    );

    if (slide.status === "pending") {
        return (
            <div className="flex w-full flex-col">
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-muted/50 p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-center text-sm text-muted-foreground">Gerando imagem…</p>
                </div>
                {textBlock}
            </div>
        );
    }

    if (slide.status === "failed") {
        return (
            <div className="flex w-full flex-col">
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-destructive/10 p-4">
                    <p className="text-center text-sm font-medium text-destructive">
                        {slide.error_message ?? "Falha ao gerar imagem."}
                    </p>
                </div>
                {textBlock}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            <div className="aspect-square w-full overflow-hidden bg-background">
                {slide.image_url ? (
                    <img
                        src={slide.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted/50 text-sm text-muted-foreground">
                        Sem imagem
                    </div>
                )}
            </div>
            {textBlock}
        </div>
    );
}

export function Post() {
    const { postPreview, updateSlideText } = useNarrativeStore();
    const { retryFailedSlides, retrying, error } = useGenerateCarousel();
    const [exportError, setExportError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);
    const router = useRouter();
    const hasFailedSlides =
        postPreview?.slides?.some(s => s.status === "failed") ?? false;

    const handleTextChange = useCallback(
        (slideIndex: number, text: string) => {
            updateSlideText(slideIndex, text);
        },
        [updateSlideText],
    );

    const handleDownloadPost = useCallback(async () => {
        if (!postPreview?.caption || !postPreview?.slides?.length) return;
        setExportError(null);
        setExporting(true);
        try {
            const blob = await exportCarouselPost(
                postPreview.caption,
                postPreview.slides.map(s => ({
                    index: s.index,
                    image_url: s.image_url,
                    text: s.text,
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
    }, [postPreview, router]);

    const caption = postPreview?.caption ?? "";
    const slides = postPreview?.slides ?? undefined;
    const readyToDownload = postPreview?.ready_to_download ?? false;

    const renderSlide = useCallback(
        (slide: CarouselSlideType) => (
            <SlideWithEditableText slide={slide} onTextChange={handleTextChange} />
        ),
        [handleTextChange],
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

                <div className="bg-foreground/5 overflow-hidden rounded-md shadow-2xl backdrop-blur-sm">
                    <div className="bg-background">
                        {slides?.length === 5 ? (
                            <Carousel slides={slides} renderSlide={renderSlide} />
                        ) : (
                            <Carousel slides={slides} />
                        )}
                    </div>

                    <div className="space-y-6 px-1 py-6 sm:px-6">
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
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-2">
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
                        className="w-full px-8 py-4 text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto disabled:pointer-events-none disabled:opacity-50"
                        onClick={handleDownloadPost}
                        disabled={!readyToDownload || exporting}
                    >
                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                            <FiDownload size={20} />
                        </span>
                        {exporting ? "Preparando download…" : "Baixar Post"}
                    </Button>
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
