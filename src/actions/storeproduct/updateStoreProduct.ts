import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"

export interface UpdateStoreProductData {
    stock?: number
    priceCost?: number
    priceList?: number
}

/**
 * Actualiza el inventario o precios de un producto en una tienda específica.
 * PATCH /storeproduct/:id
 *
 * @param id - ID del storeProduct a actualizar (storeProductID).
 * @param data - Datos a actualizar: stock, priceCost y/o priceList.
 * @returns Promesa con el storeProduct actualizado.
 */
export async function updateStoreProduct(id: string, data: UpdateStoreProductData): Promise<IStoreProduct> {
    return await fetcher<IStoreProduct>(`${API_URL}/storeproduct/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
