import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { normalizeTransfer, type RawTransfer } from "@/lib/normalize-transfer"

/**
 * Completa una transferencia y mueve el stock entre tiendas.
 * POST /transfers/:id/complete
 */
export async function completeTransfer(id: string): Promise<ITransfer> {
    const raw = await fetcher<RawTransfer>(`${API_URL}/transfers/${id}/complete`, {
        method: "POST",
    })
    return normalizeTransfer(raw)
}
