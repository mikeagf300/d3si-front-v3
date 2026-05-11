import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICreatePurchaseOrder, IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { normalizePurchaseOrder, type RawPurchaseOrder } from "@/lib/normalize-purchase-order"

/**
 * Crea una nueva orden de compra.
 * POST /purchase-orders
 */
export const createPurchaseOrder = async (data: ICreatePurchaseOrder): Promise<IPurchaseOrder> => {
    const raw = await fetcher<RawPurchaseOrder>(`${API_URL}/purchase-orders`, {
        method: "POST",
        body: JSON.stringify(data),
    })
    return normalizePurchaseOrder(raw)
}
