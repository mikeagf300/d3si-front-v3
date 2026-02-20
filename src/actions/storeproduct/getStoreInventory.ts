import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"

/**
 * Consulta el inventario completo de una tienda.
 * GET /storeproduct/inventory?storeID=string
 *
 * @param storeID - ID de la tienda cuyo inventario se desea obtener.
 * @returns Promesa con un array de productos de tienda (IStoreProduct[]).
 */
export async function getStoreInventory(storeID: string): Promise<IStoreProduct[]> {
    return await fetcher<IStoreProduct[]>(`${API_URL}/storeproduct/inventory?storeID=${storeID}`)
}
