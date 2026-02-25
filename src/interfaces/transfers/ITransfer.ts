import { IProductVariation } from "../products/IProductVariation"

export type TransferStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface ITransferItem {
    transferItemID: string
    transferID: string
    variationID: string
    quantity: number
    createdAt: string
    updatedAt: string
    variation?: IProductVariation
}

export interface ITransfer {
    transferID: string
    originStoreID: string
    destinationStoreID: string
    status: TransferStatus
    createdAt: string
    updatedAt: string
    items: ITransferItem[]
}

export interface ICreateTransferPayload {
    originStoreID: string
    destinationStoreID: string
}

export interface IAddTransferItemPayload {
    variationID: string
    quantity: number
}
