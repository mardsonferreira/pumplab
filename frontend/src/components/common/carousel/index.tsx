"use client";

import React from "react";
import Slider from "react-slick";

const images = [
    {
        id: 1,
        url: "https://picsum.photos/1024/1024",
    },
    {
        id: 2,
        url: "https://picsum.photos/1024/1024",
    },
    {
        id: 3,
        url: "https://picsum.photos/800/600",
    },
    {
        id: 4,
        url: "https://picsum.photos/800/600",
    },
    {
        id: 5,
        url: "https://picsum.photos/800/600",
    },
];

export function Carousel() {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: true,
        accessibility: true,
    };

    return (
        <div className="mx-auto w-full">
            <div className="slider-container">
                <Slider {...settings}>
                    {images.map(image => (
                        <div key={image.id} className="px-0">
                            <div className="aspect-square w-full overflow-hidden bg-background">
                                <img
                                    src={image.url}
                                    alt={`Carousel image ${image.id}`}
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
