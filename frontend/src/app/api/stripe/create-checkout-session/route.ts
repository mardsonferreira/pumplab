import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        { error: "Use backend API: POST /stripe/create-checkout-session with NEXT_PUBLIC_API_URL" },
        { status: 410 },
    );
}
