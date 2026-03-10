import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        { error: "Stripe webhook is handled by the backend. Configure Stripe to use BACKEND_URL/stripe/webhook" },
        { status: 410 },
    );
}
