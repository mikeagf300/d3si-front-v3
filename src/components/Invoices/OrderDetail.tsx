"use client"
import React, { useState, useRef, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { ProductSelector } from "@/components/Quotes/Products/ProductSelectorOrderDetail"
import type { IProduct } from "@/interfaces/products/IProduct"
import { Receipt, ShoppingBag } from "lucide-react"
import OrderMainInfo from "./OrderMainInfo"
import StoreInfo from "./StoreInfo"
import ProductsTable from "./ProductsTable"
import FinancialSummary from "./FinancialSummary"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { useReactToPrint } from "react-to-print"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { useEditOrderStore } from "@/stores/order.store"
import { useRouter } from "next/navigation"
import { updatePurchaseOrder } from "@/actions/purchase-orders/updatePurchaseOrder"
import { updatePurchaseOrderStatus } from "@/actions/purchase-orders/updatePurchaseOrderStatus"
import { Button } from "../ui/button"
import { PrintOrderView } from "./PrintOrderView"
import { useOrderInitialization } from "@/hooks/useOrderInitialization"

// Memoize components to prevent unnecessary re-renders
const MemoizedStoreInfo = React.memo(StoreInfo)
const MemoizedProductsTable = React.memo(ProductsTable)

interface Props {
    order: IPurchaseOrder
    allProducts: IProduct[]
}

export default function OrderDetail({ order, allProducts }: Props) {
    const router = useRouter()
    const { user } = useAuth()

    // Select specific state from store to minimize re-renders
    const discount = useEditOrderStore((s) => s.discount)
    const total = useEditOrderStore((s) => s.total)
    const newProducts = useEditOrderStore((s) => s.newProducts)

    // Initialize store
    useOrderInitialization(order)

    const userRole = user?.role ?? Role.Tercero
    const isAdmin = userRole === Role.Admin
    const printRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)

    const handlePrint = useReactToPrint({
        contentRef: printRef,
    })

    // Transformar datos para PrintOrderView - memoized dependent on incoming order prop
    const printOrderData = useMemo(() => {
        const orderItems = order.items || order.PurchaseOrderItems || []
        return {
            ...order,
            orderID: order.purchaseOrderID,
            ProductVariations: orderItems.map((poi: any) => ({
                ...poi.variation,
                quantityOrdered: poi.quantity || poi.quantityRequested,
                priceCost: poi.unitPrice,
            })),
        }
    }, [order])

    const [showProductSelector, setShowProductSelector] = useState(false)

    // Memoize quantities
    const cantidadTotalProductos = useMemo(() => {
        return newProducts.reduce((acc, prod) => acc + prod.variation.quantity, 0)
    }, [newProducts])

    // Mostrar fecha de emisión en UTC
    const fecha = useMemo(() => {
        const createdAtDate = new Date(order.createdAt)
        return createdAtDate.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        })
    }, [order.createdAt])

    // Handler para actualizar orden
    const handleActualizarOrden = useCallback(async () => {
        try {
            setLoading(true)
            // Access current state directly to avoid subscription in render cycle
            const currentState = useEditOrderStore.getState()

            const payload = {
                paymentStatus: currentState.status,
                dueDate: currentState.expiration || order.dueDate,
                dteNumber: currentState.dte || order.dteNumber || "",
                discount: Number(currentState.discount) || 0,
                isThirdParty: order.isThirdParty,
                storeID: currentState.storeID || order.storeID || order.store?.storeID || order.Store?.storeID,
                items: currentState.newProducts.map((item) => ({
                    variationID: item.variation.variationID,
                    quantity: item.variation.quantity,
                    unitPrice: item.variation.priceCost,
                })),
            }

            await updatePurchaseOrder(order.purchaseOrderID, payload)

            // Si el estado ha cambiado respecto al original, llamar al endpoint de status
            if (currentState.status !== (order.paymentStatus || order.status)) {
                await updatePurchaseOrderStatus(order.purchaseOrderID, currentState.status as any)
            }

            toast.success("Orden actualizada correctamente")
            router.refresh()
        } catch (e) {
            toast.error("Error al actualizar la orden")
        } finally {
            setLoading(false)
        }
    }, [order.purchaseOrderID, router])

    return (
        <div className="bg-white min-h-screen dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
            <div style={{ display: "none" }}>
                <PrintOrderView ref={printRef} order={printOrderData as any} />
            </div>
            <div className="max-w-5xl mx-auto print-container">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline text-base font-medium"
                        onClick={() => (window.location.href = "/home/invoices")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Regresar a las órdenes de compra
                    </button>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Detalles de la Orden de Compra
                    </h1>
                </div>

                <MemoizedStoreInfo store={order.store || order.Store} />

                <div className="space-y-6 pt-6">
                    <OrderMainInfo cantidadTotalProductos={cantidadTotalProductos} fecha={fecha} />

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos ({newProducts.reduce((acc, v) => acc + v.variation.quantity, 0)})
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
                                    onClick={() => router.push(`/home/order/${order.purchaseOrderID}/verify`)}
                                >
                                    Verificar Productos
                                </button>
                                {isAdmin && (
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
                                        onClick={() => setShowProductSelector(true)}
                                    >
                                        Agregar más productos
                                    </button>
                                )}
                            </div>
                        </div>
                        {showProductSelector && (
                            <div className="mb-4">
                                <ProductSelector filteredProducts={allProducts} />
                                <button
                                    className="mt-2 text-sm text-gray-500 underline"
                                    onClick={() => setShowProductSelector(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                        <MemoizedProductsTable products={newProducts} />
                    </div>

                    <FinancialSummary total={total} discount={Number(discount) || 0} />

                    <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handlePrint}
                            disabled={loading}
                        >
                            Imprimir
                        </Button>

                        {isAdmin && (
                            <Button
                                disabled={loading}
                                className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={handleActualizarOrden}
                            >
                                {loading ? `Actualizando...` : `Actualizar Orden`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
