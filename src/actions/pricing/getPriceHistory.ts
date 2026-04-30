import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPriceHistoryItem } from "@/interfaces/pricing/IPricing"

/**
 * Obtiene el historial de precios de una variación en una tienda.
 * GET /pricing/history?storeID=string&variationID=string
 */
export async function getPriceHistory(storeID: string, variationID: string): Promise<IPriceHistoryItem[]> {
    return fetcher<IPriceHistoryItem[]>(
        `${API_URL}/pricing/history?storeID=${storeID}&variationID=${variationID}`,
    )
}
