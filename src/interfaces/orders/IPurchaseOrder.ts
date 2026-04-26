import { IStore } from "../stores/IStore"
import { IProductVariation } from "../products/IProductVariation"
import { IProduct } from "../products/IProduct"
import { ICategory } from "../categories/ICategory"

export type PurchaseOrderStatus = "Pendiente" | "Pagado" | "Cancelado" | "Enviado" | "Recibido"

export interface IPurchaseOrderItem {
    variationID: string
    quantity: number
    unitPrice: number
}

export interface IPurchaseOrderItemReceived {
    variationID: string
    quantityReceived: number
    unitPrice: number
}

export interface ICreatePurchaseOrder {
    storeID: string
    items: IPurchaseOrderItem[]
    isThirdParty: boolean
    dueDate: string
    dteNumber: string
    discount: number
}

export interface IUpdatePurchaseOrder {
    paymentStatus?: string
    dueDate?: string
    dteNumber?: string
    discount?: number
    isThirdParty?: boolean
    storeID?: string
    status?: PurchaseOrderStatus
}

export interface IPurchaseOrder {
    purchaseOrderID: string
    folio: string
    storeID: string
    userID: string
    total: number
    status: PurchaseOrderStatus
    paymentStatus: string
    isThirdParty: boolean
    issueDate: string
    dueDate: string
    dteNumber: string
    totalProducts: number
    subtotal: number
    discount: number
    netTotal: number
    tax: number
    createdAt: string
    updatedAt: string
    store?: IStore
    /** @deprecated use store.name */
    Store?: IStore
    items?: any[]
    PurchaseOrderItems?: (IPurchaseOrderItem & { variation: IProductVariation & { Product: IProduct } })[]
}

export interface PurchaseOrderClientProps {
    initialProducts: IProduct[]
    initialCategories: ICategory[]
    initialStores: IStore[]
}
