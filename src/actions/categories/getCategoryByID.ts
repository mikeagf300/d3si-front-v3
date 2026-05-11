import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { ICategory } from "@/interfaces/categories/ICategory"

/**
 * Obtiene una categoría por su ID.
 * GET /categories/:id
 *
 * @param {string} id - ID de la categoría.
 * @returns {Promise<ICategory>} - Promesa que resuelve con la categoría encontrada.
 */
export const getCategoryByID = async (id: string): Promise<ICategory> => {
    return await fetcher<ICategory>(`${API_URL}/categories/${id}`)
}
