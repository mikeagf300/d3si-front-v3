import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IExpense } from "@/interfaces/expenses/IExpense"

/**
 * Obtiene todos los gastos registrados.
 * GET /expenses
 */
export const getAllExpenses = async (storeID?: string): Promise<IExpense[]> => {
    try {
        const params = new URLSearchParams()
        if (storeID) params.set("storeID", storeID)
        const query = params.toString()
        const expenses = await fetcher<IExpense[]>(`${API_URL}/expenses${query ? `?${query}` : ""}`)
        return Array.isArray(expenses) ? expenses : []
    } catch (error) {
        console.warn("getAllExpenses: Error fetching expenses:", error)
        return []
    }
}
