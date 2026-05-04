import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { normalizePurchaseOrder, type RawPurchaseOrder } from "@/lib/normalize-purchase-order"

/**
 * Obtiene todas las órdenes de compra.
 * GET /purchase-orders
 */
export const getAllPurchaseOrders = async (): Promise<IPurchaseOrder[]> => {
    let orders: IPurchaseOrder[] = []
    try {
        const raw = await fetcher<RawPurchaseOrder[]>(`${API_URL}/purchase-orders`)
        orders = Array.isArray(raw) ? raw.map(normalizePurchaseOrder) : []
    } catch (error) {
        console.warn("getAllPurchaseOrders: Error fetching orders:", error)
        return []
    }
    return orders
}
