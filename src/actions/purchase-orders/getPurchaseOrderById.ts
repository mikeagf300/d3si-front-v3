import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Obtiene el detalle de una orden de compra específica.
 * GET /purchase-orders/:id
 */
export const getPurchaseOrderById = async (id: string): Promise<IPurchaseOrder> => {
    return await fetcher<IPurchaseOrder>(`${API_URL}/purchase-orders/${id}`)
}
