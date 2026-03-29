import type { Metadata } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fontSans } from "@/lib/fonts";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getMonthlyNarrativesRemaining } from "@/utils/api/post-usage/get-monthly-narratives-remaining";
import { httpUtil } from "@/utils/common/http/server";
import "./globals.css";

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
    const supabase = await createSupabaseServerClient();
    const user = supabase
        ? (await supabase.auth.getUser()).data?.user ?? null
        : null;

    let monthlyNarrativesRemaining = 0;
    if (user) {
        try {
            const d = new Date();
            monthlyNarrativesRemaining = await getMonthlyNarrativesRemaining(
                httpUtil,
                d.getFullYear(),
                d.getMonth() + 1
            );
        } catch {
            monthlyNarrativesRemaining = 0;
        }
    }

    return (
        <html lang="en" className={fontSans.variable}>
            <body className="flex min-h-screen flex-col">
                <Header user={user} monthlyNarrativesRemaining={monthlyNarrativesRemaining} />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
