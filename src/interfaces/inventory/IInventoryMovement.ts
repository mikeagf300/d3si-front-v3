export type InventoryMovementReason =
    | "ADJUSTMENT"
    | "PURCHASE"
    | "SALE"
    | "TRANSFER_IN"
    | "TRANSFER_OUT"
    | "RETURN"
    | "LOSS"

import type { IStore } from "@/interfaces/stores/IStore"
import type { IProductVariation } from "@/interfaces/products/IProductVariation"

export interface ICreateInventoryMovement {
    storeID: string
    variationID: string
    reason: InventoryMovementReason
    quantity?: number
    newStock?: number
    referenceID?: string
}

export interface IInventoryMovement {
    movementID: string
    delta: number
    reason: InventoryMovementReason
    referenceID?: string
    createdAt: string
    store: IStore
    variation: IProductVariation
}

export interface IStoreStockResponse {
    storeID: string
    items: Array<{
        variationID: string
        sku: string
        sizeNumber: string
        quantity: number
        productID?: string
        productName?: string
    }>
}
