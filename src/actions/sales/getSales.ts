import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleProduct, ISaleResponse } from "@/interfaces/sales/ISale"
import { IStore } from "@/interfaces/stores/IStore"
import { ISaleReturn, PaymentStatus } from "@/interfaces/sales/ISale"

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
                    return await getSingleSale(sale.saleID)
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
export const getSingleSale = async (saleID: string) => {
    return await fetcher<ISaleResponse>(`${API_URL}/sales/${saleID}`)
}
