import { ICategory } from "@/interfaces/categories/ICategory"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todas las categorías raíz desde la API.
 * GET /categories
 *
 * @returns {Promise<ICategory[]>} - Promesa que resuelve con un array de objetos `ICategory`.
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
    return await fetcher<ICategory[]>(`${API_URL}/categories`)
}
