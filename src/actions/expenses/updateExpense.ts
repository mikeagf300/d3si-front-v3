import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IExpense, IUpdateExpense } from "@/interfaces/expenses/IExpense"

/**
 * Actualiza la información de un gasto por su ID.
 * PATCH /expenses/:id
 */
export const updateExpense = async (id: string, data: IUpdateExpense): Promise<IExpense> => {
    return await fetcher<IExpense>(`${API_URL}/expenses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
