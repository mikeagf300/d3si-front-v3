"use client"
import { useSaleStore } from "@/stores/sale.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { Input } from "@/components/ui/input"
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react"
import { IProductVariation, IStoreProduct } from "@/interfaces/products/IProductVariation"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"
import { useTienda } from "@/stores/tienda.store"
import { toast } from "sonner"
import { getPriceCheck } from "@/actions/pricing/getPriceCheck"
import { useSearchParams } from "next/navigation"

interface Props {
    initialProducts: IProduct[]
}

const resolveStoreProductStoreId = (storeProduct: IStoreProduct) =>
    storeProduct.storeID || storeProduct.Store?.storeID

const findStoreProductForStore = (variation: IProductVariation, storeID: string) => {
    if (!storeID) return undefined
    return variation.StoreProducts?.find((storeProduct) => resolveStoreProductStoreId(storeProduct) === storeID)
}

export const ScanInput = ({ initialProducts }: Props) => {
    const { addProduct } = useSaleStore((state) => state.actions)
    const { storeSelected } = useTienda()
    const searchParams = useSearchParams()
    const [productInput, setProductCode] = useState("")

    // Use storeID directly — Zustand may not have the full store object
    const effectiveStoreID = storeSelected?.storeID ?? searchParams.get("storeID") ?? ""

    const parentProductFinded = useMemo(() => {
        const inputTokens = productInput.toLowerCase().trim().split(/\s+/)

        if (!Array.isArray(initialProducts)) return []

        return initialProducts.filter((p) => {
            const nameTokens = p.name.toLowerCase().split(/\s+/)

            return inputTokens.every((inputToken) => nameTokens.some((nameToken) => nameToken.includes(inputToken)))
        })
    }, [productInput, initialProducts])

    const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setProductCode(e.target.value)
    }

    const handleEnterPressed = async (e: KeyboardEvent<HTMLInputElement>) => {
        const isEnterPress = e.key === "Enter" || e.key === "NumpadEnter"
        if (!isEnterPress) return
        e.preventDefault()
        const productFinded = initialProducts.find((p) =>
            p.ProductVariations.some((v) => v.sku === productInput.trim()),
        )
        if (!productFinded) {
            toast.error(`No se encontró sku: ${productInput}`)
            return
        }

        const variationFinded = productFinded.ProductVariations.find((v) => v.sku === productInput.trim())
        if (!variationFinded) return

        if (!effectiveStoreID) {
            toast.error("No hay tienda seleccionada")
            return
        }

        const storeProduct = findStoreProductForStore(variationFinded, effectiveStoreID)
        if (!storeProduct) {
            toast.error("El producto no está asignado a la tienda seleccionada")
            return
        }

        const variationWithQuantity: IVariationWithQuantity = {
            ...variationFinded,
            quantity: 1,
            stockQuantity: storeProduct.quantity,
        }

        try {
            const check = await getPriceCheck(storeProduct.storeProductID)
            addProduct(productFinded, variationWithQuantity, storeProduct, check.finalPrice, check.activeOffer)
        } catch (error) {
            addProduct(productFinded, variationWithQuantity, storeProduct)
        }

        setProductCode("")
    }
    return (
        <>
            <form
                className="flex items-center gap-2 mb-6"
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                <Input
                    type="text"
                    value={productInput}
                    onChange={handleSetInputValue}
                    onKeyDown={handleEnterPressed}
                    placeholder="Código de producto"
                    className="flex-1"
                    autoFocus
                />
            </form>
            <div className="relative">
                <ul className="absolute -top-6 bg-white dark:bg-slate-700 border rounded-lg shadow mt-2 max-h-64 overflow-y-auto z-50">
                    {productInput.length > 2 &&
                        productInput !== "" &&
                        parentProductFinded.map((product) =>
                            product.ProductVariations.map((variation) => {
                                const storeProductMatch = findStoreProductForStore(variation, effectiveStoreID)
                                const variationWithQuantity: IVariationWithQuantity = {
                                    ...variation,
                                    quantity: 1,
                                    stockQuantity: storeProductMatch?.quantity ?? 0,
                                }
                                return (
                                    <li
                                        key={variation.variationID}
                                        onClick={async () => {
                                            if (!effectiveStoreID) {
                                                toast.error("Selecciona una tienda primero")
                                                return
                                            }
                                            if (!storeProductMatch) {
                                                toast.error("El producto no está asignado a la tienda seleccionada")
                                                return
                                            }
                                            try {
                                                const check = await getPriceCheck(storeProductMatch.storeProductID)
                                                addProduct(
                                                    product,
                                                    variationWithQuantity,
                                                    storeProductMatch,
                                                    check.finalPrice,
                                                    check.activeOffer,
                                                )
                                            } catch (error) {
                                                addProduct(product, variationWithQuantity, storeProductMatch)
                                            }
                                            setProductCode("")
                                        }}
                                        className="p-2 hover:bg-blue-400 cursor-pointer transition"
                                    >
                                        {product.name} - {variation.sizeNumber}
                                    </li>
                                )
                            }),
                        )}
                </ul>
            </div>
        </>
    )
}
