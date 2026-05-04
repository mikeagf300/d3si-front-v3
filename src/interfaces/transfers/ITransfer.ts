import { IProductVariation } from "../products/IProductVariation"
import type { IStore } from "../stores/IStore"

export type TransferStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface ITransferListFilters {
    originStoreID?: string
    destinationStoreID?: string
    status?: TransferStatus
    page?: number
    limit?: number
}

export interface ITransferListMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface ITransferListResult {
    items: ITransfer[]
    meta: ITransferListMeta
}

export interface ITransferItem {
    transferItemID: string
    transferID: string
    variationID: string
    quantity: number
    createdAt: string
    updatedAt: string
    variation?: IProductVariation
    transfer?: ITransfer
}

export interface ITransfer {
    transferID: string
    originStoreID: string
    destinationStoreID: string
    status: TransferStatus
    createdAt: string
    updatedAt: string
    completedAt: string | null
    items: ITransferItem[]
    originStore?: IStore
    destinationStore?: IStore
}

export interface ICreateTransferPayload {
    originStoreID: string
    destinationStoreID: string
}

export interface IAddTransferItemPayload {
    variationID: string
    quantity: number
}
