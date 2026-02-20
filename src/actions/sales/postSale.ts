import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleRequest } from "@/interfaces/sales/ISale"

interface ResponseSale {
    message: string
    saleID: string
    total: number
}

/**
 * Registra una nueva venta en el sistema.
 * POST /sales
 */
export const createNewSale = async (saleData: ISaleRequest) => {
    try {
        const data = await fetcher<ResponseSale>(`${API_URL}/sales`, {
            method: "POST",
            body: JSON.stringify(saleData),
        })
        return data
    } catch (error) {
        console.error("Error saving the sale", error)
        return null
    }
}
