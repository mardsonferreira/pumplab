import { requireAuth } from "@/lib/auth/require-auth";
import { ReactNode } from "react";

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return await requireAuth(children);
}

