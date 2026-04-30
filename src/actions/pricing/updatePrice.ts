import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IUpdatePricePayload, IUpdatePriceResponse } from "@/interfaces/pricing/IPricing"

/**
 * Actualiza el precio de una variación y registra el historial.
 * POST /pricing/update
 */
export async function updatePrice(payload: IUpdatePricePayload): Promise<IUpdatePriceResponse> {
    return fetcher<IUpdatePriceResponse>(`${API_URL}/pricing/update`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
