import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IExpense } from "@/interfaces/expenses/IExpense"

/**
 * Obtiene todos los gastos registrados.
 * GET /expenses
 */
export const getAllExpenses = async (): Promise<IExpense[]> => {
    return await fetcher<IExpense[]>(`${API_URL}/expenses`)
}
