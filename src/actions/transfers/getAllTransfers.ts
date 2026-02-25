import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"

/**
 * Obtiene todas las transferencias.
 * GET /transfers
 */
export async function getAllTransfers(): Promise<ITransfer[]> {
    return await fetcher<ITransfer[]>(`${API_URL}/transfers`)
}
