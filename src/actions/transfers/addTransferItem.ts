import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IAddTransferItemPayload, ITransferItem } from "@/interfaces/transfers/ITransfer"
import { normalizeTransferItem, type RawTransferItem } from "@/lib/normalize-transfer"

/**
 * Agrega un producto a una transferencia pendiente.
 * POST /transfers/:id/items
 */
export async function addTransferItem(transferID: string, payload: IAddTransferItemPayload): Promise<ITransferItem> {
    const raw = await fetcher<RawTransferItem>(`${API_URL}/transfers/${transferID}/items`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
    return normalizeTransferItem(raw)
}
