import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Obtiene un producto por su ID desde la API.
 *
 * @param id - El ID del producto (productID).
 * @returns {Promise<IProduct>} - Promesa que resuelve con el producto.
 */
export const getProductById = async (id: string): Promise<IProduct> => {
    return await fetcher<IProduct>(`${API_URL}/products/${id}`)
}
