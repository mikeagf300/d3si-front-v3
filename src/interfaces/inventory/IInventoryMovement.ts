export type InventoryMovementReason =
    | "ADJUSTMENT"
    | "PURCHASE"
    | "SALE"
    | "TRANSFER_IN"
    | "TRANSFER_OUT"
    | "RETURN"
    | "LOSS"

export interface ICreateInventoryMovement {
    storeID: string
    variationID: string
    reason: InventoryMovementReason
    quantity: number
    newStock: number
    referenceID?: string
}

export interface IInventoryMovement extends ICreateInventoryMovement {
    movementID: string
    createdAt: string
}

// ─── Stock por tienda ─────────────────────────────────────────────────────────

export interface IStoreVariationStock {
    variationID: string
    sku: string
    sizeNumber: string
    quantity: number
    productID?: string
    productName?: string
}

export interface IStoreStockResponse {
    storeID: string
    items: IStoreVariationStock[]
}
