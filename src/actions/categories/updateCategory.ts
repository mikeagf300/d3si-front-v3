import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { ICategory } from "@/interfaces/categories/ICategory"

/**
 * Actualiza una categoría por su ID.
 * PATCH /categories/:id
 *
 * @param {string} id - ID de la categoría a actualizar.
 * @param {object} data - Datos a actualizar (name y/o parentID).
 * @returns {Promise<ICategory>} - Promesa que resuelve con la categoría actualizada.
 */
export async function updateCategory(id: string, data: { name?: string; parentID?: string }): Promise<ICategory> {
    return await fetcher<ICategory>(`${API_URL}/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
