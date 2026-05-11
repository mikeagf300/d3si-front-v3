import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { normalizeStoreProductList, type RawStoreProduct } from "@/lib/normalize-product"

/**
 * Obtiene el stock de inventario de una tienda específica.
 * GET /inventory/store/{storeID}
 *
 * @param storeID - ID de la tienda.
 * @returns Promesa con el stock por variación de la tienda.
 */
export async function getStoreStock(storeID: string): Promise<IStoreProduct[]> {
    const items = await fetcher<RawStoreProduct[]>(`${API_URL}/inventory/store/${storeID}`)
    return Array.isArray(items) ? normalizeStoreProductList(items) : []
}
