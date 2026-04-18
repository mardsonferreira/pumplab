"use client";

import React, { useCallback, useRef } from "react";
import Slider from "react-slick";
import type { CarouselSlide as CarouselSlideType } from "@/types";

const PLACEHOLDER_IMAGES = [1, 2, 3, 4, 5].map(id => ({
    id,
    url: "https://picsum.photos/1024/1024",
}));

interface CarouselProps {
    /** When provided, renders generated slides with text and image (or loading/error). */
    slides?: CarouselSlideType[];
    /** Called when the active slide changes (1-based index). */
    onSlideChange?: (index: number) => void;
    /** Custom renderer for each slide; when provided replaces the default SlideContent. */
    renderSlide?: (slide: CarouselSlideType, index: number) => React.ReactNode;
}

function SlideContent({ slide }: { slide: CarouselSlideType }) {
    if (slide.status === "pending") {
        return (
            <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 bg-muted/50 p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-center text-sm text-muted-foreground">Gerando imagem...</p>
                <p className="line-clamp-3 text-center text-sm text-foreground">{slide.text}</p>
            </div>
        );
    }
    if (slide.status === "failed") {
        return (
            <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 bg-destructive/10 p-4">
                <p className="text-center text-sm font-medium text-destructive">
                    {slide.error_message ?? "Falha ao gerar imagem."}
                </p>
                <p className="line-clamp-3 text-center text-sm text-foreground">{slide.text}</p>
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
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted/50 text-sm text-muted-foreground">
                        Sem imagem
                    </div>
                )}
            </div>
            <div className="border-t border-foreground/10 bg-background px-3 py-2">
                <p className="line-clamp-2 text-sm text-foreground">{slide.text}</p>
            </div>
        </div>
    );
}

function SlideWrapper({ children }: { children: React.ReactNode }) {
    return <div className="w-full">{children}</div>;
}

export function Carousel({ slides, onSlideChange, renderSlide }: CarouselProps) {
    const sliderRef = useRef<Slider>(null);

    const handleAfterChange = useCallback(
        (currentSlide: number) => {
            if (!slides?.length || !onSlideChange) return;
            const slide = slides[currentSlide];
            if (slide) onSlideChange(slide.index);
        },
        [slides, onSlideChange],
    );

    const settings = {
        dots: false,
        fade: true,
        infinite: !!slides?.length,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        autoplay: false,//!onSlideChange && !!slides?.length,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: true,
        accessibility: true,
        afterChange: handleAfterChange,
    };

    const items = slides?.length === 5 ? slides : null;

    return (
        <div className="mx-auto w-full">
            <div className="slider-container">
                <Slider ref={sliderRef} {...settings}>
                    {items
                        ? items.map((slide, idx) => (
                              <div key={slide.index} className="px-0">
                                  <SlideWrapper>
                                      {renderSlide
                                          ? renderSlide(slide, idx)
                                          : <SlideContent slide={slide} />}
                                  </SlideWrapper>
                              </div>
                          ))
                        : PLACEHOLDER_IMAGES.map(image => (
                              <div key={image.id} className="px-0">
                                  <div className="aspect-square w-full overflow-hidden bg-background">
                                      <img
                                          src={image.url}
                                          alt=""
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                      />
                                  </div>
                              </div>
                          ))}
                </Slider>
            </div>
        </div>
    );
}
