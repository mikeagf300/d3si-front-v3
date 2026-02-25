export type PriceType = "LIST" | "COST"
export type DiscountType = "PERCENTAGE" | "FIXED_PRICE"

// ─── Actualización de precio ──────────────────────────────────────────────────

export interface IUpdatePricePayload {
    storeID: string
    variationID: string
    priceType: PriceType
    newPrice: number
    reason?: string
    changedBy?: string
}

export interface IUpdatePriceResponse {
    message: string
    variationID: string
    priceType: PriceType
    newPrice: number
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
    createdAt: string
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
}

export interface IUpdateOfferPayload extends Partial<ICreateOfferPayload> {}

export interface IOffer {
    offerID: string
    storeProductID: string
    description?: string
    discountType: DiscountType
    value: number
    startDate: string
    endDate?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
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
