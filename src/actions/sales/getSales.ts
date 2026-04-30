import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { normalizeSale, type RawSale } from "@/lib/normalize-sale"
import { getChileDateMeta, toChileMiddayUTC } from "@/utils/chile-date"

const DAY_MS = 24 * 60 * 60 * 1000

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

    let sales: RawSale[] = []
    try {
        sales = await fetcher<RawSale[]>(url)
    } catch (error) {
        console.warn("getSales: Error al obtener las ventas:", error)
        return []
    }

    if (!Array.isArray(sales)) {
        console.warn("getSales: La respuesta de la API no es un array:", sales)
        return []
    }

    return sales.map(normalizeSale)
}

/**
 * Obtiene el detalle de una venta específica por su ID.
 * GET /sales/:id
 */
export const getSingleSale = async (saleID: string, storeID?: string): Promise<ISaleResponse> => {
    const params = new URLSearchParams()
    if (storeID) params.set("storeID", storeID)
    const url = `${API_URL}/sales/${saleID}${params.toString() ? `?${params.toString()}` : ""}`
    const raw = await fetcher<RawSale>(url)
    return normalizeSale(raw)
}

/**
 * Ventas para construir resumen del mes en curso (y últimos 7 días) en la fecha de referencia.
 * Útil cuando la API solo soporta `date` (día) pero el front necesita totales del mes.
 */
export const getSalesForResume = async (storeID: string | undefined, refYYYYMMDD: string): Promise<ISaleResponse[]> => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(refYYYYMMDD)) {
        console.warn("getSalesForResume: refYYYYMMDD inválido:", refYYYYMMDD)
        return []
    }

    const refDate = toChileMiddayUTC(refYYYYMMDD)
    const refMeta = getChileDateMeta(refDate)
    const last7StartDayNumber = refMeta.dayNumber - 6 * DAY_MS

    const allSales = await getSales(storeID)
    return allSales.filter((sale) => {
        const saleMeta = getChileDateMeta(new Date(sale.createdAt))
        const inLast7 = saleMeta.dayNumber >= last7StartDayNumber && saleMeta.dayNumber <= refMeta.dayNumber
        const inMonth = saleMeta.year === refMeta.year && saleMeta.month === refMeta.month
        return inLast7 || inMonth
    })
}
