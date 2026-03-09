import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Obtiene todas las órdenes de compra.
 * GET /purchase-orders
 */
export const getAllPurchaseOrders = async (): Promise<IPurchaseOrder[]> => {
    let orders: IPurchaseOrder[] = []
    try {
        orders = await fetcher<IPurchaseOrder[]>(`${API_URL}/purchase-orders`)
    } catch (error) {
        console.warn("getAllPurchaseOrders: Error fetching orders:", error)
        return []
    }

    if (!Array.isArray(orders)) {
        console.warn("getAllPurchaseOrders: La respuesta no es un array:", orders)
        return []
    }
    return orders
}
