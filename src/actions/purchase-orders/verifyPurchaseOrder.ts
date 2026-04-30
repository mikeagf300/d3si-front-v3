import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrderItemReceived } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Verifica los productos recibidos para una orden de compra.
 * POST /purchase-orders/:id/verify
 */
export const verifyPurchaseOrder = async (id: string, items: IPurchaseOrderItemReceived[]): Promise<void> => {
    await fetcher<void>(`${API_URL}/purchase-orders/${id}/verify`, {
        method: "POST",
        body: JSON.stringify({ items }),
    })
}
