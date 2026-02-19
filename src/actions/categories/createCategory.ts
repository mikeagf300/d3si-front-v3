import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICategory } from "@/interfaces/categories/ICategory"

/**
 * Crea una nueva categoría.
 * Si se omite el parentID, se crea como categoría raíz.
 * Si se incluye el parentID, se crea como subcategoría.
 * POST /categories
 *
 * @param {string} name - Nombre de la categoría.
 * @param {string} [parentID] - ID de la categoría padre (opcional).
 * @returns {Promise<ICategory>} - Promesa que resuelve con la categoría creada.
 */
export async function createCategory(name: string, parentID?: string): Promise<ICategory> {
    return await fetcher<ICategory>(`${API_URL}/categories`, {
        method: "POST",
        body: JSON.stringify({ name, ...(parentID ? { parentID } : {}) }),
    })
}
