import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleResponse } from "@/interfaces/sales/ISale"

/**
 * Obtiene todas las ventas registradas.
 * GET /sales
 */
export const getSales = async (storeID?: string, date?: string): Promise<ISaleResponse[]> => {
    let url = `${API_URL}/sales`
    if (storeID || date) {
        const params = new URLSearchParams()
        if (storeID) params.append("storeID", storeID)
        if (date) params.append("date", date)
        url += `?${params.toString()}`
    }

    let sales: ISaleResponse[] = []
    try {
        sales = await fetcher<ISaleResponse[]>(url)
    } catch (error) {
        console.warn("getSales: Error al obtener las ventas:", error)
        return []
    }

    // Validamos que sales sea un array para evitar el error "sales.map is not a function"
    if (!Array.isArray(sales)) {
        console.warn("getSales: La respuesta de la API no es un array:", sales)
        return []
    }

    // Si hay ventas anuladas, traemos el detalle para obtener la información del Return
    // que usualmente no viene en el listado general
    const salesWithDetails = await Promise.all(
        sales.map(async (sale) => {
            if (sale.status === "Anulado" && !sale.Return) {
                try {
                    return await getSingleSale(sale.saleID)
                } catch (error) {
                    console.error(`Error fetching details for sale ${sale.saleID}:`, error)
                    return sale
                }
            }
            return sale
        }),
    )

    return salesWithDetails
}

/**
 * Obtiene el detalle de una venta específica por su ID.
 * GET /sales/:id
 */
export const getSingleSale = async (saleID: string) => {
    return await fetcher<ISaleResponse>(`${API_URL}/sales/${saleID}`)
}
