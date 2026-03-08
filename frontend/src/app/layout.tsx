import type { Metadata } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fontSans } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Async Server Component; cast so TS accepts Promise<Element> as valid JSX child (Next.js 14 supports this)
const HeaderComponent = Header as unknown as React.ComponentType;

export const metadata: Metadata = {
    title: "PumpLab - AI Content for Personal Trainers",
    description:
        "AI-powered content generation for Instagram Reels and Carousels designed specifically for fitness professionals.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={fontSans.variable}>
            <body className="flex min-h-screen flex-col">
                <HeaderComponent />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
