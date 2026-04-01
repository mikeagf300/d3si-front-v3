import { ISendSaleReturn } from "@/interfaces/sales/ISale"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

export interface AnularSale {
    saleID: string
    nullNote: ISendSaleReturn
    // Opcional: información del producto específico a devolver/anular
    productToReturn?: {
        storeProductID?: string
        saleProductID?: string
        variationID?: string
        quantity: number
    }
}

/**
 * Anula una venta o registra una devolución.
 * PUT /sales
 */
export const anularSale = async (details: AnularSale) => {
    return fetcher(`${API_URL}/sales`, {
        method: "PUT",
        body: JSON.stringify(details),
    })
}
