import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

export const getMetaMensual = async (storeID: string, _date?: string): Promise<number> => {
    try {
        const response = await fetcher<unknown>(`${API_URL}/store-monthly-targets/${storeID}`)

        if (typeof response === "number") return response

        if (response && typeof response === "object" && "targetAmount" in response) {
            const targetAmount = (response as { targetAmount?: unknown }).targetAmount
            if (typeof targetAmount === "number") return targetAmount
            const parsed = Number(targetAmount)
            if (!Number.isNaN(parsed)) return parsed
        }

        return 0
    } catch (error) {
        throw new Error("Error fetching meta mensual", { cause: error })
    }
}
