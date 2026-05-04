import { IRawProduct } from "@/interfaces/products/IRawProduct"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

export const getInventoryProducts = async (limit?: number, offset?: number): Promise<IRawProduct[]> => {
    const params = new URLSearchParams()
    if (limit !== undefined) params.append("limit", limit.toString())
    if (offset !== undefined) params.append("offset", offset.toString())

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`
    try {
        const raw = await fetcher<IRawProduct[]>(url)
        if (!Array.isArray(raw)) {
            console.warn("getInventoryProducts: La respuesta no es un array:", raw)
            return []
        }
        return raw
    } catch (error) {
        console.warn("getInventoryProducts: Error fetching products:", error)
        return []
    }
}
