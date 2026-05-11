import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { normalizeTransfer, type RawTransfer } from "@/lib/normalize-transfer"

/**
 * Obtiene los detalles de una transferencia por ID.
 * GET /transfers/:id
 */
export async function getTransferById(id: string): Promise<ITransfer> {
    const raw = await fetcher<RawTransfer>(`${API_URL}/transfers/${id}`)
    return normalizeTransfer(raw)
}
