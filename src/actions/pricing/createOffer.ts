import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreateOfferPayload, IOffer } from "@/interfaces/pricing/IPricing"

/**
 * Crea una oferta especial para un producto de tienda.
 * POST /pricing/offers
 */
export async function createOffer(payload: ICreateOfferPayload): Promise<IOffer> {
    return fetcher<IOffer>(`${API_URL}/pricing/offers`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
