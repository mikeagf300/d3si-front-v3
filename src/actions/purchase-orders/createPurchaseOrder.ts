import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreatePurchaseOrder, IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"

/**
 * Crea una nueva orden de compra.
 * POST /purchase-orders
 */
export const createPurchaseOrder = async (data: ICreatePurchaseOrder): Promise<IPurchaseOrder> => {
    return await fetcher<IPurchaseOrder>(`${API_URL}/purchase-orders`, {
        method: "POST",
        body: JSON.stringify(data),
    })
}
