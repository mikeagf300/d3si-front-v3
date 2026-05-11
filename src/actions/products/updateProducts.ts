import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Actualiza un producto en la base de datos mediante una petición HTTP PATCH.
 *
 * @param id - El ID del producto (productID).
 * @param data - Los datos a actualizar del producto.
 * @returns {Promise<IProduct>} - Promesa que resuelve con el producto actualizado.
 */
export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct> => {
    return await fetcher<IProduct>(`${API_URL}/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
