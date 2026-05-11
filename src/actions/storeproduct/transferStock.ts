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
 * @deprecated The backend no longer exposes `/storeproduct/transfer`.
 * Use the `/transfers` workflow or `/inventory/movements` depending on the case.
 *
 * @param payload - Objeto con el ID de la tienda destino y los ítems a transferir.
 * @returns Promesa con la respuesta del servidor.
 */
export async function transferStock(payload: TransferStockPayload): Promise<{ message: string }> {
    console.warn("transferStock is deprecated. Use the transfers workflow or inventory movements instead.", payload)
    return { message: "deprecated" }
}
