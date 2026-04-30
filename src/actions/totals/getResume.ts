"use server"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IResume } from "@/interfaces/sales/ISalesResume"

export const getResume = async (storeID: string, date: string): Promise<IResume> => {
    try {
        const params = new URLSearchParams()
        if (storeID) params.set("storeId", storeID)
        if (date) {
            const [year, month, day] = date.split("-").map(Number)
            if (year && month && day) {
                const from = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString()
                const to = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0)).toISOString()
                params.set("from", from)
                params.set("to", to)
            }
        }
        const query = params.toString()
        const response = await fetcher<IResume>(`${API_URL}/reports/sales${query ? `?${query}` : ""}`)
        return response
    } catch (error) {
        throw new Error("Error fetching sales resume", { cause: error })
    }
}
