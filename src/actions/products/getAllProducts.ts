import { IProduct } from "@/interfaces/products/IProduct"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { RawProduct, normalizeProduct } from "@/lib/normalize-product"

export const getAllProducts = async (limit?: number, offset?: number): Promise<IProduct[]> => {
    const params = new URLSearchParams()
    if (limit !== undefined) params.append("limit", limit.toString())
    if (offset !== undefined) params.append("offset", offset.toString())

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`
    try {
        const raw = await fetcher<RawProduct[]>(url)
        if (!Array.isArray(raw)) {
            console.warn("getAllProducts: La respuesta no es un array:", raw)
            return []
        }
        return raw.map(normalizeProduct)
    } catch (error) {
        console.warn("getAllProducts: Error fetching products:", error)
        return []
    }
}
