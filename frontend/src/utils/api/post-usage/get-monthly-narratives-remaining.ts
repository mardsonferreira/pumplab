import { HttpUtil } from "@/utils/common/http";

type MonthlyNarrativesRemainingResponse = {
    monthlyNarrativesRemaining: number;
};

export async function getMonthlyNarrativesRemaining(
    httpUtil: HttpUtil,
    year: number,
    month: number
): Promise<number> {
    const data = await httpUtil.get<MonthlyNarrativesRemainingResponse>(
        `/post-usage/monthly-narratives-remaining?year=${year}&month=${month}`
    );
    return data.monthlyNarrativesRemaining ?? 0;
}
