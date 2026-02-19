import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Elimina una categoría por su ID.
 * DELETE /categories/:id
 *
 * @param {string} id - ID de la categoría a eliminar.
 * @returns {Promise<{ message: string }>} - Promesa que resuelve con mensaje de confirmación.
 */
export async function deleteCategory(id: string): Promise<{ message: string }> {
    return await fetcher<{ message: string }>(`${API_URL}/categories/${id}`, {
        method: "DELETE",
    })
}
