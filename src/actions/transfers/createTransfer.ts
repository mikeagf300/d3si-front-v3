import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreateTransferPayload, ITransfer } from "@/interfaces/transfers/ITransfer"

/**
 * Crea una nueva transferencia entre tiendas.
 * POST /transfers
 */
export async function createTransfer(payload: ICreateTransferPayload): Promise<ITransfer> {
    return await fetcher<ITransfer>(`${API_URL}/transfers`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
