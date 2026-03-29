import { httpUtil } from "@/utils/common/http/client";

type GetTotalPostsGeneratedResponse = {
    posts_generated?: number;
};

export async function getTotalPostsGenerated(
    year: number,
    month: number
): Promise<number | undefined> {
    const response = await httpUtil.get<GetTotalPostsGeneratedResponse>(
        `/post-usage/posts-generated?year=${year}&month=${month}`
    );
    return response.posts_generated;
}
