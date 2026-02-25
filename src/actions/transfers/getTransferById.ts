import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"

/**
 * Obtiene los detalles de una transferencia por ID.
 * GET /transfers/:id
 */
export async function getTransferById(id: string): Promise<ITransfer> {
    return await fetcher<ITransfer>(`${API_URL}/transfers/${id}`)
}
