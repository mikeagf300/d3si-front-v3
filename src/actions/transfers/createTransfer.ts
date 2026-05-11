import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreateTransferPayload, ITransfer } from "@/interfaces/transfers/ITransfer"
import { normalizeTransfer, type RawTransfer } from "@/lib/normalize-transfer"

/**
 * Crea una nueva transferencia entre tiendas.
 * POST /transfers
 */
export async function createTransfer(payload: ICreateTransferPayload): Promise<ITransfer> {
    const raw = await fetcher<RawTransfer>(`${API_URL}/transfers`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
    return normalizeTransfer(raw)
}
