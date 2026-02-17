import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Busca un producto por SKU dentro de un array de productos y filtra por tienda.
 * Esta es una función helper para el componente de inventario.
 */
export const findProductBySku = (products: IProduct[], storeId: string, skuInput: string) => {
    for (const product of products) {
        const variation = product.ProductVariations.find((v) => v.sku === skuInput)
        if (variation && variation.StoreProducts) {
            const variationStoreProduct = variation.StoreProducts.find((sp) => sp.storeID === storeId)
            if (!variationStoreProduct) return null

            return {
                ...variationStoreProduct,
                ...variation,
                name: product.name,
                image: product.image || "",
                storeProductID: variationStoreProduct.storeProductID || "",
                priceList: Number(variation.priceList),
                stock: variationStoreProduct.quantity ?? 0,
            }
        }
    }

    return null
}
