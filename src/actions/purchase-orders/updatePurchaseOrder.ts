import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IPurchaseOrder, IUpdatePurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Actualiza los datos generales de una orden de compra.
 * PATCH /purchase-orders/:id
 */
export const updatePurchaseOrder = async (id: string, data: IUpdatePurchaseOrder): Promise<IPurchaseOrder> => {
    return await fetcher<IPurchaseOrder>(`${API_URL}/purchase-orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
