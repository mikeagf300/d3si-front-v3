import { ICategory } from "@/interfaces/categories/ICategory"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

type RawCategory = Omit<ICategory, "subcategories"> & { children?: RawCategory[] }

const mapCategory = (raw: RawCategory): ICategory => ({
    ...raw,
    subcategories: raw.children?.map(mapCategory) ?? [],
})

/**
 * Obtiene todas las categorías raíz desde la API.
 * GET /categories
 *
 * @returns {Promise<ICategory[]>} - Promesa que resuelve con un array de objetos `ICategory`.
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
    const raw = await fetcher<RawCategory[]>(`${API_URL}/categories`)
    return raw.map(mapCategory)
}
