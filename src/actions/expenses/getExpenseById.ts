import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IExpense } from "@/interfaces/expenses/IExpense"

/**
 * Obtiene un gasto por su ID.
 * GET /expenses/:id
 */
export const getExpenseById = async (id: string): Promise<IExpense> => {
    return await fetcher<IExpense>(`${API_URL}/expenses/${id}`)
}
