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
        const orderItems = order.items || order.PurchaseOrderItems || []

        // Mapeo manual de campos para compatibilidad con el store existente
        updateOrderStringField("orderID", order.purchaseOrderID)
        updateOrderStringField("storeID", order.storeID || order.store?.storeID || order.Store?.storeID || "")
        updateOrderStringField("userID", order.userID)
        updateOrderStringField("total", order.total)
        updateOrderStringField("status", order.paymentStatus || order.status)
        updateOrderStringField("discount", order.discount)
        updateOrderStringField("expiration", order.dueDate)
        updateOrderStringField("dte", order.dteNumber)
        updateOrderStringField("createdAt", order.createdAt)
        updateOrderStringField("updatedAt", order.updatedAt)

        if (orderItems.length > 0) {
            orderItems.forEach((poi: any) => {
                // El nuevo formato tiene variation.Product, pero si no viene usamos una estructura base
                const product = poi.variation?.Product || poi.variation?.product || { name: "Producto", productID: "N/A" }
                const variationWithQuantity = {
                    ...poi.variation,
                    quantity: poi.quantity || poi.quantityRequested,
                    priceCost: poi.unitPrice,
                }
                addProduct(product, variationWithQuantity)
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
