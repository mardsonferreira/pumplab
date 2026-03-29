import { httpUtil } from "@/utils/common/http/client";

type UpdateTotalPostsGeneratedResponse = {
    posts_generated?: number;
};

export async function updateTotalPostsGenerated(
    year: number,
    month: number,
    value: number
): Promise<number | undefined> {
    const response = await httpUtil.post<UpdateTotalPostsGeneratedResponse>(
        "/post-usage/posts-generated",
        {
            body: { year, month, value },
        }
    );
    return response.posts_generated;
}
