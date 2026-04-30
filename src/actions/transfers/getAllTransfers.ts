import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { normalizeTransfer, type RawTransfer } from "@/lib/normalize-transfer"

/**
 * Obtiene todas las transferencias.
 * GET /transfers
 */
export async function getAllTransfers(): Promise<ITransfer[]> {
    const raw = await fetcher<RawTransfer[]>(`${API_URL}/transfers`)
    return Array.isArray(raw) ? raw.map(normalizeTransfer) : []
}
