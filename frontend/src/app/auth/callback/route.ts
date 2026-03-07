import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const ACCESS_TOKEN_COOKIE = "sb-access-token";
const REFRESH_TOKEN_COOKIE = "sb-refresh-token";

function getBackendUrl(): string {
    return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
}

function sanitizeNextPath(nextPath: string | null): string {
    if (!nextPath || !nextPath.startsWith("/")) {
        return "/dashboard";
    }
    // Block protocol-relative or absolute-like values such as "//evil.com".
    if (nextPath.startsWith("//")) {
        return "/dashboard";
    }
    return nextPath;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const nextPath = sanitizeNextPath(searchParams.get("next"));

    if (!code) {
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session?.access_token) {
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token ?? "";
    const secure = process.env.NODE_ENV === "production";

    const redirectRes = NextResponse.redirect(new URL(nextPath, request.url));

    // Set Next.js-side cookies for server components and middleware (requireAuth, session refresh)
    redirectRes.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    redirectRes.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });

    // Call the backend directly from the server to set its own httpOnly cookies.
    // This avoids the previous approach of passing tokens via a JS-readable cookie,
    // which silently failed for large JWTs (ES256 tokens exceed the 4096-byte cookie limit).
    try {
        const backendRes = await fetch(`${getBackendUrl()}/auth/set-cookies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        });

        if (backendRes.ok) {
            // Forward the Set-Cookie headers from the backend response so the browser
            // receives the backend-domain cookies in this same redirect response
            backendRes.headers.getSetCookie().forEach((cookie) => {
                redirectRes.headers.append("Set-Cookie", cookie);
            });
        }
    } catch {
        // Non-fatal: the user still lands on the app; backend calls will 401 until resolved
    }

    return redirectRes;
}
