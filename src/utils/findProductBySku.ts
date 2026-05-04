import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Busca un producto por SKU dentro de un array de productos y filtra por tienda.
 * Esta es una función helper para el componente de inventario.
 */
export const findProductBySku = (products: any[], storeId: string, skuInput: string) => {
    for (const product of products) {
        const variations = product.ProductVariations || product.variations || []
        const variation = variations.find((v: any) => v.sku === skuInput)
        
        if (variation) {
            const storeProducts = variation.StoreProducts || variation.storeProducts || []
            const variationStoreProduct = storeProducts.find((sp: any) => sp.storeID === storeId) || storeProducts[0]
            
            if (!variationStoreProduct) return null

            return {
                ...variationStoreProduct,
                ...variation,
                name: product.name,
                image: product.image || "",
                storeProductID: variationStoreProduct.storeProductID || "",
                priceList: Number(variationStoreProduct.priceList || variation.priceList || 0),
                stock: variationStoreProduct.quantity ?? variationStoreProduct.stock ?? 0,
            }
        }
    }

    return null
}
