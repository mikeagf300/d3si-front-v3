import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Obtiene todas las órdenes de compra.
 * GET /purchase-orders
 */
export const getAllPurchaseOrders = async (): Promise<IPurchaseOrder[]> => {
    return await fetcher<IPurchaseOrder[]>(`${API_URL}/purchase-orders`)
}
