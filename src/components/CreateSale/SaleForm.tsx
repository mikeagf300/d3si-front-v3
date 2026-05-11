"use client"
import { useEffect, useMemo, useState } from "react"
import { ScanInput } from "@/components/CreateSale/ScanInput"
import { CartTable } from "@/components/CreateSale/CartTable"
import { useSaleStore } from "@/stores/sale.store"
import { ISaleRequest, PaymentType } from "@/interfaces/sales/ISale"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { IProduct } from "@/interfaces/products/IProduct"
import { toPrice } from "@/utils/priceFormat"
import { Button } from "../ui/button"
import { useTienda } from "@/stores/tienda.store"
import { createNewSale } from "@/actions/sales/postSale"
import { updateSaleStatus } from "@/actions/sales/updateSaleStatus"
import { toast } from "sonner"
import { DiscountModal, DiscountStoreProductOption } from "@/components/Discounts/DiscountModal"
import { getPriceCheck } from "@/actions/pricing/getPriceCheck"

const isSpecialStoreFilter = (value: string | null) => value === "all" || value === "propias" || value === "consignadas"

export const SaleForm = ({ initialProducts }: { initialProducts: IProduct[] }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { cartItems, paymentMethod, actions } = useSaleStore()
    const { setPaymentMethod, clearCart, updateCartItemPricing } = actions
    const { storeSelected } = useTienda()
    const [loading, setLoading] = useState(false)
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)

    const urlStoreID = searchParams.get("storeID")
    const effectiveStoreID =
        storeSelected?.storeID ?? (urlStoreID && !isSpecialStoreFilter(urlStoreID) ? urlStoreID : "")
    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.finalPrice ?? item.priceList
            return acc + item.quantity * price
        }, 0)
    }, [cartItems])

    const discountableStoreProducts = useMemo<DiscountStoreProductOption[]>(() => {
        const seen = new Set<string>()
        return cartItems
            .filter((item) => Boolean(item.storeProductID))
            .filter((item) => {
                if (seen.has(item.storeProductID)) return false
                seen.add(item.storeProductID)
                return true
            })
            .map((item) => ({
                storeProductID: item.storeProductID,
                productName: item.productName,
                variationName: item.sizeNumber,
                storeName: item.storeName ?? item.storeID,
                storeID: item.storeID,
                priceList: item.priceList,
            }))
    }, [cartItems])

    const hasDiscountableProducts = discountableStoreProducts.length > 0
    const handleDiscountCreated = async (storeProductID: string) => {
        try {
            const priceCheck = await getPriceCheck(storeProductID)
            updateCartItemPricing(storeProductID, {
                finalPrice: priceCheck.finalPrice,
                activeOffer: priceCheck.activeOffer ?? undefined,
            })
        } catch (error) {
            console.error("SaleForm: error refreshing pricing", error)
            toast.error("No se pudo actualizar el precio del producto")
        }
    }

    const handleSubmit = async () => {
        try {
            const hasEmptyProducts = cartItems.filter((item) => item.quantity === 0)
            if (hasEmptyProducts.length > 0) {
                return toast.error("Por favor elimina los productos sin stock")
            }
            if (!effectiveStoreID) return toast.error("No hay una tienda elegida")

            const storeIDsInCart = new Set(cartItems.map((item) => item.storeID).filter(Boolean))
            if (storeIDsInCart.size > 1) {
                return toast.error("El carrito contiene productos de distintas tiendas.")
            }
            if (storeIDsInCart.size === 1 && !storeIDsInCart.has(effectiveStoreID)) {
                return toast.error("La tienda seleccionada no coincide con los productos del carrito.")
            }

            setLoading(true)
            const toSubmitSale: ISaleRequest = {
                paymentType: paymentMethod,
                storeID: effectiveStoreID,
                items: cartItems.map((item) => ({
                    variationID: item.variationID,
                    quantity: item.quantity,
                    unitPrice: item.finalPrice ?? item.priceList,
                })),
            }

            const res = await createNewSale(toSubmitSale)
            if (res) {
                if (res.saleID) {
                    await updateSaleStatus(res.saleID, { status: "Pagado" })
                }
                toast.success("Venta generada exitosamente! Redirigiendo...")
                actions.clearCart()
                router.refresh()
                router.push(
                    res.saleID
                        ? `/home/${res.saleID}?storeID=${effectiveStoreID}`
                        : `/home?storeID=${effectiveStoreID}`,
                )
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falló al crear la venta :("
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            clearCart()
        }
    }, [clearCart])

    return (
        <>
            <ScanInput initialProducts={initialProducts} />

            <CartTable />
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col md:flex-row items-center justify-between md:justify-end gap-4 md:gap-8">
                    <p className="text-xl font-semibold dark:text-white text-gray-800">Total: ${toPrice(total)}</p>
                    <div className="flex md:flex-row flex-col items-center gap-2">
                        <label
                            htmlFor="pago"
                            className="dark:text-slate-300 text-gray-700 font-medium whitespace-nowrap flex-shrink-0"
                        >
                            Tipo de pago:
                        </label>
                        <Select value={paymentMethod} onValueChange={(value: PaymentType) => setPaymentMethod(value)}>
                            <SelectTrigger className="p-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Seleccionar tipo de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Efectivo">Efectivo</SelectItem>
                                <SelectItem value="Debito">Débito</SelectItem>
                                <SelectItem value="Credito">Crédito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        disabled={loading || cartItems.length === 0}
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        {loading ? "Procesando..." : "Vender"}
                    </Button>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDiscountModalOpen(true)}
                            disabled={!hasDiscountableProducts}
                        >
                            Crear descuento
                        </Button>
                        {!hasDiscountableProducts && (
                            <p className="text-xs text-gray-500">
                                Agrega un producto con stock asignado para habilitar descuentos.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <DiscountModal
                isOpen={isDiscountModalOpen}
                onClose={() => setIsDiscountModalOpen(false)}
                options={discountableStoreProducts}
                initialStoreProductID={discountableStoreProducts[0]?.storeProductID}
                onOfferCreated={(storeProductID) => handleDiscountCreated(storeProductID)}
            />
        </>
    )
}
