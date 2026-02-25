import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"

/**
 * Completa una transferencia y mueve el stock entre tiendas.
 * POST /transfers/:id/complete
 */
export async function completeTransfer(id: string): Promise<ITransfer> {
    return await fetcher<ITransfer>(`${API_URL}/transfers/${id}/complete`, {
        method: "POST",
    })
}
