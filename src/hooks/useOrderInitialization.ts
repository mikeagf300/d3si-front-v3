import { useEffect } from "react"
import { useEditOrderStore } from "@/stores/order.store"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { useLoadingToaster } from "@/stores/loading.store"
import { toast } from "sonner"

export const useOrderInitialization = (order: IPurchaseOrder) => {
    const { actions } = useEditOrderStore()
    const { addProduct, updateOrderStringField, clearCart } = actions
    const { activeToastId, setToastId } = useLoadingToaster()

    // Carga la orden en el store global de zustand
    useEffect(() => {
        clearCart()
        // Mapeo manual de campos para compatibilidad con el store existente
        updateOrderStringField("orderID", order.purchaseOrderID)
        updateOrderStringField("storeID", order.storeID)
        updateOrderStringField("userID", order.userID)
        updateOrderStringField("total", order.total)
        updateOrderStringField("status", order.status)
        updateOrderStringField("discount", order.discount)
        updateOrderStringField("createdAt", order.createdAt)
        updateOrderStringField("updatedAt", order.updatedAt)

        if (order.PurchaseOrderItems) {
            order.PurchaseOrderItems.forEach((poi) => {
                const variationWithQuantity = {
                    ...poi.variation,
                    quantity: poi.quantity,
                    priceCost: poi.unitPrice,
                }
                addProduct(poi.variation.Product, variationWithQuantity)
            })
        }
    }, [order, addProduct, updateOrderStringField, clearCart])

    useEffect(() => {
        if (activeToastId) {
            toast.success("Orden cargada!", { id: activeToastId })
            setToastId(null)
        }
    }, [activeToastId, setToastId])
}
