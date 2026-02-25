import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPriceCheck } from "@/interfaces/pricing/IPricing"

/**
 * Calcula el precio final de un producto de tienda incluyendo ofertas activas.
 * GET /pricing/price-check/:storeProductID
 */
export async function getPriceCheck(storeProductID: string): Promise<IPriceCheck> {
    return await fetcher<IPriceCheck>(`${API_URL}/pricing/price-check/${storeProductID}`)
}
