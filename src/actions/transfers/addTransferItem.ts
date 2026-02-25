import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IAddTransferItemPayload, ITransferItem } from "@/interfaces/transfers/ITransfer"

/**
 * Agrega un producto a una transferencia pendiente.
 * POST /transfers/:id/items
 */
export async function addTransferItem(transferID: string, payload: IAddTransferItemPayload): Promise<ITransferItem> {
    return await fetcher<ITransferItem>(`${API_URL}/transfers/${transferID}/items`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
