import { create } from "zustand"
import { toast } from "sonner"
import { useTienda } from "./tienda.store"
import { PaymentType } from "@/interfaces/sales/ISale"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"

import { IOffer } from "@/interfaces/pricing/IPricing"

interface SaleItem {
    product: IProduct
    variation: IVariationWithQuantity
    storeProduct: IStoreProduct
    finalPrice?: number
    activeOffer?: IOffer
}

interface SaleState {
    cartItems: SaleItem[]
    paymentMethod: PaymentType
    loading: boolean
    actions: {
        addProduct: (
            product: IProduct,
            variation: IVariationWithQuantity,
            storeProduct: IStoreProduct,
            finalPrice?: number,
            activeOffer?: IOffer,
        ) => void
        removeProduct: (sku: string) => void
        updateQuantity: (sku: string, quantity: number) => void
        setPaymentMethod: (method: PaymentType) => void
        clearCart: () => void
    }
}

export const useSaleStore = create<SaleState>((set, get) => ({
    cartItems: [],
    paymentMethod: "Efectivo",
    loading: false,
    actions: {
        addProduct: (product, variation, storeProduct, finalPrice, activeOffer) => {
            const { storeSelected } = useTienda.getState()
            if (!storeSelected) {
                toast.error("Debes elegir una tienda")
                return
            }
            const { cartItems } = get()

            const existingItem = cartItems.find((p) => p.variation.sku === variation.sku)
            const stockQuantity = existingItem ? existingItem.variation.stockQuantity : variation.stockQuantity
            const currentQuantity = existingItem ? existingItem.variation.quantity : 0
            if (currentQuantity + 1 > stockQuantity) {
                toast("No se puede agregar más, stock insuficiente.")
                return
            }

            if (existingItem) {
                const newCartItems = cartItems.map((item) => {
                    if (item.variation.sku === variation.sku) {
                        return {
                            ...item,
                            variation: {
                                ...item.variation,
                                quantity: item.variation.quantity + 1,
                            },
                        }
                    }
                    return item
                })
                set({ cartItems: newCartItems })
            } else {
                const newCartItems = [
                    ...cartItems,
                    {
                        product,
                        storeProduct,
                        variation: { ...variation, quantity: 1 },
                        finalPrice,
                        activeOffer,
                    },
                ]
                set({ cartItems: newCartItems })
            }
        },
        removeProduct: (sku) => {
            set((state) => {
                const newCartItems = state.cartItems.filter((item) => item.variation.sku !== sku)
                return { cartItems: newCartItems }
            })
        },
        updateQuantity: (sku, quantity) => {
            set((state) => {
                const newCartItems = state.cartItems.map((item) =>
                    item.variation.sku === sku ? { ...item, variation: { ...item.variation, quantity } } : item,
                )
                return { cartItems: newCartItems }
            })
        },
        setPaymentMethod: (method) => {
            set({ paymentMethod: method })
        },
        clearCart: () => {
            set({ cartItems: [] })
        },
    },
}))
