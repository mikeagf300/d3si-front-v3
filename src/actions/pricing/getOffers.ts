import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISpecialOffer } from "@/interfaces/pricing/IPricing"

/**
 * Obtiene todas las ofertas especiales creadas o filtra por producto de tienda.
 * GET /pricing/offers
 */
export async function getOffers(storeProductID?: string): Promise<ISpecialOffer[]> {
    const params = new URLSearchParams()
    if (storeProductID) params.append("storeProductID", storeProductID)

    const url = `${API_URL}/pricing/offers${params.toString() ? `?${params.toString()}` : ""}`
    return fetcher<ISpecialOffer[]>(url)
}
