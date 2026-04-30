import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { IProductVariation, IStoreProduct } from "@/interfaces/products/IProductVariation"
import type { IStore } from "@/interfaces/stores/IStore"
import { pickArray, pickFirst, toNumber, toStringValue } from "./normalize-helpers"
import { normalizeStore } from "./normalize-user-store"

export type RawStoreProduct = {
    storeProductID?: string
    variationID?: string
    storeID?: string
    stock?: number
    priceCost?: string | number
    priceList?: string | number
    createdAt?: string
    updatedAt?: string
    store?: IStore | null
    Store?: IStore | null
}

type RawVariation = {
    variationID?: string
    productID?: string
    sku?: string
    size?: string
    color?: string | null
    createdAt?: string
    updatedAt?: string
    storeProducts?: RawStoreProduct[]
    StoreProducts?: RawStoreProduct[]
}

export type RawProduct = {
    productID?: string
    image?: string
    categoryID?: string | null
    category?: ICategory | null
    name?: string
    brand?: string
    genre?: IProduct["genre"]
    description?: string | null
    variations?: RawVariation[]
    createdAt?: string
    updatedAt?: string
    wooID?: number | null
    totalProducts?: number
}

const normalizeStoreProduct = (raw: RawStoreProduct): IStoreProduct => ({
    storeProductID: raw.storeProductID ?? "",
    variationID: raw.variationID ?? "",
    storeID: pickFirst(raw.storeID, raw.store?.storeID, raw.Store?.storeID) ?? "",
    quantity: raw.stock ?? 0,
    priceCostStore: toStringValue(raw.priceCost),
    priceListStore: toStringValue(pickFirst(raw.priceList, raw.priceCost)),
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    Store: normalizeStore(pickFirst(raw.store, raw.Store) ?? {}),
})

const normalizeVariation = (raw: RawVariation): IProductVariation => {
    const storeProducts = pickArray(raw.storeProducts, raw.StoreProducts).map(normalizeStoreProduct)
    return {
        variationID: raw.variationID ?? "",
        productID: raw.productID ?? "",
        sku: raw.sku ?? "",
        sizeNumber: raw.size ?? "",
        priceList: storeProducts[0] ? toNumber(storeProducts[0].priceListStore) : 0,
        priceCost: storeProducts[0] ? toNumber(storeProducts[0].priceCostStore) : 0,
        stockQuantity: storeProducts.reduce((sum, storeProduct) => sum + storeProduct.quantity, 0),
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        Stores: storeProducts.map((storeProduct) => storeProduct.Store),
        StoreProducts: storeProducts,
    }
}

export const normalizeProduct = (raw: RawProduct): IProduct => {
    const variations = (raw.variations ?? []).map(normalizeVariation)

    return {
        productID: raw.productID ?? "",
        image: raw.image ?? "",
        categoryID: raw.categoryID ?? null,
        Category: raw.category ?? undefined,
        name: raw.name ?? "",
        brand: (raw.brand as IProduct["brand"]) ?? "Otro",
        genre: raw.genre ?? "Unisex",
        description: raw.description ?? "",
        wooID: raw.wooID ?? null,
        totalProducts: raw.totalProducts ?? 0,
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        ProductVariations: variations,
        stock: variations.reduce((sum, variation) => sum + variation.stockQuantity, 0),
    }
}

export const normalizeStoreProductList = (items: RawStoreProduct[]): IStoreProduct[] => items.map(normalizeStoreProduct)
