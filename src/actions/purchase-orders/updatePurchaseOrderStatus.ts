import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder, PurchaseOrderStatus } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Actualiza el estado o pago de una orden de compra.
 * PATCH /purchase-orders/:id/status
 */
export const updatePurchaseOrderStatus = async (id: string, status: PurchaseOrderStatus): Promise<IPurchaseOrder> => {
    return await fetcher<IPurchaseOrder>(`${API_URL}/purchase-orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
}
