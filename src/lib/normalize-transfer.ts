import type { IProductVariation } from "@/interfaces/products/IProductVariation"
import type { IStore } from "@/interfaces/stores/IStore"
import type { ITransfer, ITransferItem } from "@/interfaces/transfers/ITransfer"
import { normalizeStore } from "./normalize-user-store"

type RawTransferVariation = {
    variationID?: string
    productID?: string
    sku?: string
    size?: string
    sizeNumber?: string
    color?: string | null
    createdAt?: string
    updatedAt?: string
}

type RawTransferStore = IStore | null | undefined

export type RawTransferItem = {
    transferItemID?: string
    transferItemId?: string
    id?: string
    transferID?: string
    transferId?: string
    quantity?: number
    createdAt?: string
    updatedAt?: string
    variationID?: string
    variation?: RawTransferVariation | null
    transfer?: RawTransfer | null
}

export type RawTransfer = {
    transferID?: string
    transferId?: string
    id?: string
    status?: ITransfer["status"] | string
    createdAt?: string
    updatedAt?: string
    completedAt?: string | null
    originStoreID?: string
    destinationStoreID?: string
    originStore?: RawTransferStore
    destinationStore?: RawTransferStore
    items?: RawTransferItem[]
    transferItems?: RawTransferItem[]
}

const normalizeVariation = (raw: RawTransferVariation | null | undefined): IProductVariation => ({
    variationID: raw?.variationID ?? "",
    productID: raw?.productID ?? "",
    sizeNumber: raw?.sizeNumber ?? raw?.size ?? "",
    priceList: 0,
    priceCost: 0,
    sku: raw?.sku ?? "",
    stockQuantity: 0,
    createdAt: raw?.createdAt ?? "",
    updatedAt: raw?.updatedAt ?? "",
    Stores: [],
    StoreProducts: [],
})

export const normalizeTransferItem = (raw: RawTransferItem): ITransferItem => ({
    transferItemID: raw.transferItemID ?? raw.transferItemId ?? raw.id ?? "",
    transferID: raw.transferID ?? raw.transferId ?? "",
    variationID: raw.variationID ?? raw.variation?.variationID ?? "",
    quantity: raw.quantity ?? 0,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    variation: normalizeVariation(raw.variation),
})

export const normalizeTransfer = (raw: RawTransfer): ITransfer => {
    const originStore = raw.originStore ?? null
    const destinationStore = raw.destinationStore ?? null
    const items = raw.items ?? raw.transferItems ?? []

    return {
        transferID: raw.transferID ?? raw.transferId ?? raw.id ?? "",
        originStoreID: raw.originStoreID ?? originStore?.storeID ?? "",
        destinationStoreID: raw.destinationStoreID ?? destinationStore?.storeID ?? "",
        status: (raw.status as ITransfer["status"]) ?? "PENDING",
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        completedAt: raw.completedAt ?? null,
        items: items.map(normalizeTransferItem),
        originStore: originStore ? normalizeStore(originStore) : undefined,
        destinationStore: destinationStore ? normalizeStore(destinationStore) : undefined,
    }
}
