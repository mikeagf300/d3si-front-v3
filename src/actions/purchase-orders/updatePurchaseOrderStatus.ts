import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder, PurchaseOrderStatus } from "@/interfaces/orders/IPurchaseOrder"
import { normalizePurchaseOrder, type RawPurchaseOrder } from "@/lib/normalize-purchase-order"

/**
 * Actualiza el estado o pago de una orden de compra.
 * PATCH /purchase-orders/:id/status
 */
export const updatePurchaseOrderStatus = async (id: string, status: PurchaseOrderStatus): Promise<IPurchaseOrder> => {
    const raw = await fetcher<RawPurchaseOrder>(`${API_URL}/purchase-orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
    return normalizePurchaseOrder(raw)
}
