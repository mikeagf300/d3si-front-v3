import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

export interface TransferItem {
    variationID: string
    stock: number
    priceCost: number
}

export interface TransferStockPayload {
    targetStoreID: string
    items: TransferItem[]
}

/**
 * Transfiere stock desde la bodega central a una tienda específica.
 * POST /storeproduct/transfer
 *
 * @param payload - Objeto con el ID de la tienda destino y los ítems a transferir.
 * @returns Promesa con la respuesta del servidor.
 */
export async function transferStock(payload: TransferStockPayload): Promise<{ message: string }> {
    return await fetcher<{ message: string }>(`${API_URL}/storeproduct/transfer`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
