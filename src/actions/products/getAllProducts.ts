import { IProduct } from "@/interfaces/products/IProduct"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

type RawStoreProduct = {
    storeProductID: string
    variationID: string
    storeID: string
    stock: number
    priceCost: string
    priceList: string
    createdAt: string
    updatedAt: string
    store: any
}

type RawVariation = {
    variationID: string
    productID: string
    sku: string
    size: string
    color: string | null
    createdAt: string
    updatedAt: string
    storeProducts: RawStoreProduct[]
}

type RawProduct = {
    productID: string
    name: string
    image: string
    brand: string
    genre: string
    description: string | null
    categoryID: string | null
    category?: any
    wooID?: number | null
    totalProducts?: number
    createdAt: string
    updatedAt: string
    variations: RawVariation[]
}

const mapProduct = (raw: RawProduct): IProduct => ({
    productID: raw.productID,
    name: raw.name,
    image: raw.image,
    brand: raw.brand as IProduct["brand"],
    genre: raw.genre as IProduct["genre"],
    description: raw.description ?? "",
    categoryID: raw.categoryID,
    Category: raw.category,
    wooID: raw.wooID ?? null,
    totalProducts: raw.totalProducts ?? 0,
    stock: raw.variations.reduce((acc, v) => acc + v.storeProducts.reduce((a, sp) => a + sp.stock, 0), 0),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    ProductVariations: raw.variations.map((v) => {
        const firstSP = v.storeProducts[0]
        return {
            variationID: v.variationID,
            productID: v.productID,
            sku: v.sku,
            sizeNumber: v.size,
            priceCost: firstSP ? parseFloat(firstSP.priceCost) : 0,
            priceList: firstSP ? parseFloat(firstSP.priceList) : 0,
            stockQuantity: v.storeProducts.reduce((acc, sp) => acc + sp.stock, 0),
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
            StoreProducts: v.storeProducts.map((sp) => ({
                storeProductID: sp.storeProductID,
                variationID: sp.variationID,
                storeID: sp.storeID,
                quantity: sp.stock,
                priceCostStore: sp.priceCost,
                createdAt: sp.createdAt,
                updatedAt: sp.updatedAt,
                Store: sp.store,
            })),
        }
    }),
})

export const getAllProducts = async (limit?: number, offset?: number): Promise<IProduct[]> => {
    const params = new URLSearchParams()
    if (limit !== undefined) params.append("limit", limit.toString())
    if (offset !== undefined) params.append("offset", offset.toString())

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`
    try {
        const raw = await fetcher<RawProduct[]>(url)
        if (!Array.isArray(raw)) {
            console.warn("getAllProducts: La respuesta no es un array:", raw)
            return []
        }
        return raw.map(mapProduct)
    } catch (error) {
        console.warn("getAllProducts: Error fetching products:", error)
        return []
    }
}
