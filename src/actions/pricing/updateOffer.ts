import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IUpdateOfferPayload, IOffer } from "@/interfaces/pricing/IPricing"

/**
 * Actualiza una oferta especial existente por ID.
 * POST /pricing/offers/:id
 */
export async function updateOffer(offerID: string, payload: IUpdateOfferPayload): Promise<IOffer> {
    return await fetcher<IOffer>(`${API_URL}/pricing/offers/${offerID}`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
