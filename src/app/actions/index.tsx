"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function getTotalPostsGenerated(year: number, month: number) {
    const supabase = await createSupabaseServerClient();
    const {data, error} = await supabase.from("post_usage").select("posts_generated").eq("year", year).eq("month", month).single();

    if (error) {
        throw new Error(error.message);
    }

    return data?.posts_generated;
}

export async function updateTotalPostsGenerated(year: number, month: number, value: number) {
    const supabase = await createSupabaseServerClient();
    const {error} = await supabase.from("post_usage").update({posts_generated: value}).eq("year", year).eq("month", month).single();

    if (error) {
        throw new Error(error.message);
    }
}