import type { IProduct } from "@/interfaces/products/IProduct"
import type { IProductVariation } from "@/interfaces/products/IProductVariation"
import type { IStore } from "@/interfaces/stores/IStore"
import type { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { pickArray, pickFirst, toNumber } from "./normalize-helpers"
import { normalizeStore } from "./normalize-user-store"

type RawPurchaseOrderVariation = IProductVariation & {
    Product?: IProduct
}

type RawPurchaseOrderItem = {
    purchaseOrderItemID?: string
    purchaseOrder?: unknown
    variationID?: string
    variation?: RawPurchaseOrderVariation | null
    unitPrice?: number | string
    subtotal?: number | string
    quantityRequested?: number
    quantityReceived?: number
    createdAt?: string
    updatedAt?: string
}

export type RawPurchaseOrder = {
    purchaseOrderID?: string
    folio?: string
    storeID?: string
    userID?: string
    user?: { userID?: string } | null
    total?: number | string
    subtotal?: number | string
    netTotal?: number | string
    tax?: number | string
    discount?: number | string
    status?: IPurchaseOrder["status"] | string
    paymentStatus?: string | { status?: string } | null
    isThirdParty?: boolean
    dueDate?: string | null
    issueDate?: string
    dteNumber?: string | null
    totalProducts?: number
    createdAt?: string
    updatedAt?: string
    store?: IStore | null
    Store?: IStore | null
    items?: RawPurchaseOrderItem[]
    PurchaseOrderItems?: RawPurchaseOrderItem[]
}

const normalizeVariation = (raw: RawPurchaseOrderVariation | null | undefined): IProductVariation & { Product: IProduct } => ({
    variationID: raw?.variationID ?? "",
    productID: raw?.productID ?? "",
    sizeNumber: raw?.sizeNumber ?? "",
    priceList: toNumber(raw?.priceList),
    priceCost: toNumber(raw?.priceCost),
    sku: raw?.sku ?? "",
    stockQuantity: raw?.stockQuantity ?? 0,
    createdAt: raw?.createdAt ?? "",
    updatedAt: raw?.updatedAt ?? "",
    Stores: raw?.Stores ?? [],
    StoreProducts: raw?.StoreProducts ?? [],
    Product: raw?.Product ?? ({
        productID: raw?.productID ?? "",
        image: "",
        brand: "Otro",
        genre: "Unisex",
        description: "",
        wooID: null,
        totalProducts: 0,
        createdAt: raw?.createdAt ?? "",
        updatedAt: raw?.updatedAt ?? "",
        ProductVariations: [],
        categoryID: null,
        stock: 0,
        name: "",
    } as IProduct),
})

const normalizeItem = (raw: RawPurchaseOrderItem) => ({
    purchaseOrderItemID: raw.purchaseOrderItemID ?? "",
    variationID: raw.variationID ?? raw.variation?.variationID ?? "",
    quantity: pickFirst(raw.quantityRequested, raw.quantityReceived) ?? 0,
    unitPrice: toNumber(raw.unitPrice),
    subtotal: toNumber(raw.subtotal),
    quantityRequested: raw.quantityRequested,
    quantityReceived: raw.quantityReceived,
    variation: normalizeVariation(raw.variation),
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
})

export const normalizePurchaseOrder = (raw: RawPurchaseOrder): IPurchaseOrder => {
    const store = pickFirst(raw.store, raw.Store) ?? null
    const items = pickArray(raw.items, raw.PurchaseOrderItems)
    const paymentStatus = typeof raw.paymentStatus === "string" ? raw.paymentStatus : raw.paymentStatus?.status
    const status = raw.status ?? paymentStatus ?? "Pendiente"

    return {
        purchaseOrderID: raw.purchaseOrderID ?? "",
        storeID: raw.storeID ?? store?.storeID ?? "",
        userID: raw.userID ?? raw.user?.userID ?? "",
        total: Number(raw.total ?? raw.netTotal ?? 0),
        status: status as IPurchaseOrder["status"],
        paymentStatus: paymentStatus ?? status,
        isThirdParty: raw.isThirdParty ?? false,
        dueDate: raw.dueDate ?? "",
        dteNumber: raw.dteNumber ?? "",
        discount: Number(raw.discount ?? 0),
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        Store: store ? normalizeStore(store) : undefined,
        PurchaseOrderItems: items.map(normalizeItem),
    }
}
