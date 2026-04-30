"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { IProduct } from "@/interfaces/products/IProduct"
import { DiscountModal, DiscountStoreProductOption } from "./DiscountModal"

interface DiscountManagementPanelProps {
    products: IProduct[]
}

export function DiscountManagementPanel({ products }: DiscountManagementPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialStoreProduct, setInitialStoreProduct] = useState<string>()

    const storeProductOptions = useMemo<DiscountStoreProductOption[]>(() => {
        const flattened: DiscountStoreProductOption[] = []
        products.forEach((product) => {
            product.ProductVariations.forEach((variation) => {
                variation.StoreProducts?.forEach((storeProduct) => {
                    flattened.push({
                        storeProductID: storeProduct.storeProductID,
                        productName: product.name,
                        variationName: variation.sizeNumber,
                        storeName: storeProduct.Store?.name ?? "",
                        storeID: storeProduct.storeID,
                        priceList: variation.priceList,
                    })
                })
            })
        })
        return flattened
    }, [products])

    const previewList = storeProductOptions.slice(0, 10)

    const handleOpenModal = (storeProductID?: string) => {
        setInitialStoreProduct(storeProductID)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500">Inventario</p>
                    <h1 className="text-2xl font-bold">Ofertas y descuentos</h1>
                    <p className="text-sm text-gray-500">Crea descuentos por producto o tienda sin salir de este módulo.</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(storeProductOptions[0]?.storeProductID)}>
                    Crear descuento manual
                </Button>
            </header>

            {storeProductOptions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    Ningún producto tiene asignación de tienda aun.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {previewList.map((option) => (
                        <article
                            key={option.storeProductID}
                            className="border rounded-xl p-4 bg-white shadow-sm dark:bg-slate-900"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{option.productName}</p>
                                    <p className="text-xs text-gray-500">
                                        Talla {option.variationName} · {option.storeName}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-gray-600">${option.priceList?.toLocaleString("es-CL")}</span>
                            </div>
                            <p className="mt-3 text-xs text-gray-400">storeProductID: {option.storeProductID}</p>
                            <div className="mt-4 flex justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleOpenModal(option.storeProductID)}>
                                    Crear oferta
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {storeProductOptions.length > previewList.length && (
                <p className="text-sm text-gray-500">
                    Se listan los primeros {previewList.length} storeProducts. Usa el botón superior para elegir otro producto.
                </p>
            )}

            <DiscountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                options={storeProductOptions}
                initialStoreProductID={initialStoreProduct}
            />
        </div>
    )
}
