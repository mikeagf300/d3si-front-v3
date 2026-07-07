export type PriceType = "list" | "cost"
export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FIXED_PRICE"
export type DiscountScope = "UNIT" | "TOTAL"

// ─── Actualización de precio ──────────────────────────────────────────────────

export interface IUpdatePricePayload {
    storeID: string
    variationID: string
    priceType: PriceType
    newPrice: number
    reason?: string
    changedBy?: string
}

export interface IUpdatePriceStoreProduct {
    storeProductID: string
    stock: number
    priceCost: number
    priceList: number
    createdAt: string
    updatedAt: string
}

export interface IUpdatePriceResponse {
    historyID: string
    storeProduct: IUpdatePriceStoreProduct
    priceType: PriceType
    oldPrice: number
    newPrice: number
    reason?: string | null
    effectiveDate: string
    changedBy?: string | null
}

// ─── Historial de precios ─────────────────────────────────────────────────────

export interface IPriceHistoryItem {
    historyID: string
    storeID: string
    variationID: string
    priceType: PriceType
    oldPrice: number
    newPrice: number
    reason?: string
    changedBy?: string
    createdAt?: string
    effectiveDate?: string
}

// ─── Ofertas especiales ───────────────────────────────────────────────────────

export interface ICreateOfferPayload {
    storeProductID: string
    discountType: DiscountType
    value: number
    startDate: string
    description?: string
    endDate?: string
    isActive: boolean
    scope?: DiscountScope
    exclusive?: boolean
}

export type IUpdateOfferPayload = Partial<ICreateOfferPayload>

export interface IOffer {
    offerID: string
    storeProductID: string
    description?: string
    discountType: DiscountType
    value: number
    startDate: string
    endDate?: string
    isActive: boolean
    scope?: DiscountScope
    exclusive?: boolean
    createdAt: string
    updatedAt: string
}

export interface ISpecialOfferStoreProductVariation {
    variationID: string
    size?: string
    sizeNumber?: string
    color?: string
    product?: {
        productID: string
        name: string
        image?: string
        description?: string
    }
}

export interface ISpecialOfferStoreProductStore {
    storeID: string
    name: string
}

export interface ISpecialOfferStoreProduct {
    storeProductID: string
    priceList?: number
    priceCost?: number
    store?: ISpecialOfferStoreProductStore
    Store?: ISpecialOfferStoreProductStore
    variation?: ISpecialOfferStoreProductVariation
    variationID?: string
}

export interface ISpecialOffer extends Omit<IOffer, "storeProductID"> {
    storeProductID?: string
    storeProduct?: ISpecialOfferStoreProduct | null
}

// ─── Price Check (precio final con oferta) ────────────────────────────────────

export interface IPriceCheck {
    storeProductID: string
    basePrice: number
    finalPrice: number
    discount?: number
    discountType?: DiscountType
    activeOffer?: IOffer
    hasActiveOffer: boolean
}
