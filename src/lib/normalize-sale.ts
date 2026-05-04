import type { IStore } from "@/interfaces/stores/IStore"
import type { IUser } from "@/interfaces/users/IUser"
import type { ISaleProduct, ISaleResponse, ISaleReturn, IsaleProductReturned, IVariationInSale } from "@/interfaces/sales/ISale"
import { pickArray, pickFirst, toStringValue } from "./normalize-helpers"
import { normalizeStore } from "./normalize-user-store"

export type RawSaleVariation = {
    variationID?: string
    productID?: string
    sku?: string
    color?: string | null
    size?: string
    sizeNumber?: string
    createdAt?: string
    updatedAt?: string
}

export type RawSaleProduct = {
    saleProductID?: string
    saleID?: string
    variationID?: string
    variation?: RawSaleVariation | null
    unitPrice?: number | string
    subtotal?: number | string
    quantitySold?: number
    quantity?: number
    createdAt?: string
    updatedAt?: string
}

export type RawSaleReturnProduct = {
    returnItemID?: string
    returnID?: string
    storeProductID?: string
    saleProductID?: string
    variationID?: string
    returnedQuantity?: number
    unitPrice?: number | string
    createdAt?: string
    updatedAt?: string
}

export type RawSaleReturn = {
    returnID?: string
    saleID?: string
    clientEmail?: string
    reason?: string
    type?: ISaleReturn["type"]
    processedBy?: string
    additionalNotes?: string
    createdAt?: string
    updatedAt?: string
    user?: IUser | null
    User?: IUser | null
    ProductAnulations?: RawSaleReturnProduct[]
    productAnulations?: RawSaleReturnProduct[]
}

export type RawSale = {
    saleID?: string
    id?: string
    storeID?: string
    store?: IStore | null
    Store?: IStore | null
    total?: number | string
    status?: ISaleResponse["status"] | string
    createdAt?: string
    updatedAt?: string
    paymentType?: ISaleResponse["paymentType"]
    saleProducts?: RawSaleProduct[]
    SaleProducts?: RawSaleProduct[]
    return?: RawSaleReturn | null
    Return?: RawSaleReturn | null
}

const normalizeVariation = (raw: RawSaleVariation | null | undefined): IVariationInSale => ({
    variationID: raw?.variationID ?? "",
    productID: raw?.productID ?? "",
    sku: raw?.sku ?? "",
    color: raw?.color ?? "",
    size: pickFirst(raw?.size, raw?.sizeNumber) ?? "",
    createdAt: raw?.createdAt ?? "",
    updatedAt: raw?.updatedAt ?? "",
})

const normalizeSaleProduct = (raw: RawSaleProduct): ISaleProduct => ({
    saleProductID: raw.saleProductID ?? "",
    saleID: raw.saleID ?? "",
    variationID: raw.variationID ?? raw.variation?.variationID ?? "",
    variation: normalizeVariation(raw.variation),
    unitPrice: raw.unitPrice ?? 0,
    subtotal: raw.subtotal ?? 0,
    quantitySold: pickFirst(raw.quantitySold, raw.quantity) ?? 0,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
})

const normalizeReturnItem = (raw: RawSaleReturnProduct): IsaleProductReturned => ({
    returnItemID: raw.returnItemID ?? "",
    returnID: raw.returnID ?? "",
    storeProductID: raw.storeProductID,
    saleProductID: raw.saleProductID,
    variationID: raw.variationID,
    returnedQuantity: raw.returnedQuantity ?? 0,
    unitPrice: toStringValue(raw.unitPrice),
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
})

const normalizeSaleReturn = (raw: RawSaleReturn | null | undefined): ISaleReturn | null => {
    if (!raw) return null

    const fallbackUser: IUser = {
        userID: "",
        name: raw.processedBy ?? "",
        email: raw.clientEmail ?? "",
        role: "admin",
        password: "",
        userImg: null,
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        userStores: [],
        Stores: [],
    }

    return {
        returnID: raw.returnID ?? "",
        saleID: raw.saleID ?? "",
        clientEmail: raw.clientEmail ?? "",
        reason: raw.reason ?? "",
        type: raw.type ?? "DEVOLUCION",
        processedBy: raw.processedBy ?? "",
        additionalNotes: raw.additionalNotes ?? "",
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        User: raw.user ?? raw.User ?? fallbackUser,
        ProductAnulations: (raw.ProductAnulations ?? raw.productAnulations ?? []).map(normalizeReturnItem),
    }
}

export const normalizeSale = (raw: RawSale): ISaleResponse => {
    const store = pickFirst(raw.store, raw.Store) ?? null
    const saleProducts = pickArray(raw.saleProducts, raw.SaleProducts)
    const saleReturn = pickFirst(raw.return, raw.Return) ?? null

    return {
        saleID: raw.saleID ?? raw.id ?? "",
        storeID: raw.storeID ?? store?.storeID ?? "",
        total: Number(raw.total ?? 0),
        status: (raw.status as ISaleResponse["status"]) ?? "Pendiente",
        createdAt: raw.createdAt ?? "",
        paymentType: raw.paymentType,
        Store: normalizeStore(store ?? {}),
        SaleProducts: saleProducts.map(normalizeSaleProduct),
        Return: normalizeSaleReturn(saleReturn),
    }
}
