import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Elimina un producto por su ID.
 *
 * @param id - El ID del producto (productID).
 * @returns {Promise<{ message: string }>} - Promesa que resuelve con mensaje de confirmación.
 */
export async function deleteProduct(id: string): Promise<{ message: string }> {
    return await fetcher<{ message: string }>(`${API_URL}/products/${id}`, {
        method: "DELETE",
    })
}
