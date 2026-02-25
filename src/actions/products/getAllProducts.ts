import { IProduct } from "@/interfaces/products/IProduct"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todos los productos desde la API con soporte de paginación.
 *
 * @param limit - Cantidad máxima de productos a retornar por página (opcional).
 * @param offset - Número de elementos a omitir desde el inicio (opcional).
 * @returns {Promise<IProduct[]>} - Promesa que resuelve con un array de objetos `IProduct`.
 */
export const getAllProducts = async (limit?: number, offset?: number): Promise<IProduct[]> => {
    const params = new URLSearchParams()
    if (limit !== undefined) params.append("limit", limit.toString())
    if (offset !== undefined) params.append("offset", offset.toString())

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`
    const products = await fetcher<IProduct[]>(url)
    if (!Array.isArray(products)) {
        console.warn("getAllProducts: La respuesta no es un array:", products)
        return []
    }
    return products
}
