import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStoreStockResponse } from "@/interfaces/inventory/IInventoryMovement"

/**
 * Obtiene el stock de inventario de una tienda específica.
 * GET /inventory/store/:storeID
 *
 * @param storeID - ID de la tienda.
 * @returns Promesa con el stock por variación de la tienda.
 */
export async function getStoreStock(storeID: string): Promise<IStoreStockResponse> {
    return await fetcher<IStoreStockResponse>(`${API_URL}/inventory/store/${storeID}`)
}
