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
import { updateTotalPostsGenerated } from "@/utils/api/post-usage/update-total-posts-generated";

export function Post() {
    const { postPreview } = useNarrativeStore();
    const { retryFailedSlides, retrying, error } = useGenerateCarousel();
    const [exportError, setExportError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);
    const router = useRouter();
    const hasFailedSlides =
        postPreview?.slides?.some(s => s.status === "failed") ?? false;

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
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            try {
                await updateTotalPostsGenerated(year, month, 1);
            } catch (err) {
                console.error(err);
            }
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
    }, [postPreview]);

    const caption = postPreview?.caption ?? "";
    const slides = postPreview?.slides ?? undefined;
    const readyToDownload = postPreview?.ready_to_download ?? false;

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
                        <Carousel slides={slides} />
                    </div>

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