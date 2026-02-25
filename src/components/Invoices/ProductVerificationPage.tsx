"use client"
import React from "react"
import type { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import type { IProduct } from "@/interfaces/products/IProduct"
import { useOrderInitialization } from "@/hooks/useOrderInitialization"
import { useEditOrderStore } from "@/stores/order.store"
import ProductVerification from "./ProductVerification"

interface Props {
    order: IPurchaseOrder
    allProducts: IProduct[]
}

export function ProductVerificationPage({ order, allProducts }: Props) {
    useOrderInitialization(order)
    const newProducts = useEditOrderStore((s) => s.newProducts)

    if ((order.PurchaseOrderItems?.length ?? 0) > 0 && newProducts.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-600 dark:bg-slate-950 dark:text-gray-300">
                Preparando productos para verificación...
            </div>
        )
    }

    return (
        <ProductVerification orderId={order.purchaseOrderID} originalProducts={newProducts} allProducts={allProducts} />
    )
}

export default ProductVerificationPage
