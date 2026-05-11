import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreateExpense, IExpense } from "@/interfaces/expenses/IExpense"

/**
 * Registra un nuevo gasto.
 * POST /expenses
 */
export const createExpense = async (data: ICreateExpense): Promise<IExpense> => {
    return await fetcher<IExpense>(`${API_URL}/expenses`, {
        method: "POST",
        body: JSON.stringify(data),
    })
}
