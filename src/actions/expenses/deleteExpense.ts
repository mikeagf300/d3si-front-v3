import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Elimina un gasto por su ID.
 * DELETE /expenses/:id
 */
export const deleteExpense = async (id: string): Promise<void> => {
    await fetcher<void>(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
    })
}
