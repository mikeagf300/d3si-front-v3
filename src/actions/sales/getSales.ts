import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleProduct, ISaleResponse } from "@/interfaces/sales/ISale"
import { IStore } from "@/interfaces/stores/IStore"
import { ISaleReturn, PaymentStatus } from "@/interfaces/sales/ISale"

const CHILE_TZ = "America/Santiago"
const chileDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const DAY_MS = 24 * 60 * 60 * 1000

const getChileDateMeta = (date: Date) => {
    const parts = chileDateFormatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
        if (part.type === "year" || part.type === "month" || part.type === "day") acc[part.type] = part.value
        return acc
    }, {})
    const year = Number(parts.year)
    const month = Number(parts.month) - 1
    const day = Number(parts.day)
    return {
        year,
        month,
        day,
        dayNumber: Date.UTC(year, month, day),
    }
}

type RawSale = {
    saleID: string
    storeID: string
    store?: IStore
    Store?: IStore
    status: PaymentStatus
    total: string | number
    paymentType?: string
    createdAt: string
    updatedAt?: string
    saleProducts?: ISaleProduct[]
    SaleProducts?: ISaleProduct[]
    Return?: ISaleReturn | null
}

const normalizeSale = (sale: RawSale): ISaleResponse => ({
    ...sale,
    Store: (sale.Store ?? sale.store ?? {}) as IStore,
    total: typeof sale.total === "string" ? parseFloat(sale.total) : sale.total,
    SaleProducts: (sale.SaleProducts ?? sale.saleProducts ?? []).map((sp) => ({
        ...sp,
        unitPrice: typeof sp.unitPrice === "string" ? parseFloat(sp.unitPrice as string) : sp.unitPrice,
        subtotal: typeof sp.subtotal === "string" ? parseFloat(sp.subtotal as string) : sp.subtotal,
    })),
    Return: sale.Return ?? null,
})

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

    const salesWithDetails = await Promise.all(
        sales.map(async (sale) => {
            if (sale.status === "Anulado" && !sale.Return) {
                try {
                    return await getSingleSale(sale.saleID, sale.storeID)
                } catch (error) {
                    console.error(`Error fetching details for sale ${sale.saleID}:`, error)
                    return normalizeSale(sale)
                }
            }
            return normalizeSale(sale)
        }),
    )

    return salesWithDetails
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
    const [year, month, day] = refYYYYMMDD.split("-").map(Number)
    if (!year || !month || !day) {
        console.warn("getSalesForResume: refYYYYMMDD inválido:", refYYYYMMDD)
        return []
    }

    // Mediodía UTC para anclar el día en Chile de forma determinística.
    const refDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
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
