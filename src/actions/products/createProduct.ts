import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Crea un nuevo producto con sus variantes.
 *
 * @param data - Los datos del producto a crear.
 * @returns {Promise<IProduct>} - Promesa que resuelve con el producto creado.
 */
export async function createProduct(data: Partial<IProduct>): Promise<IProduct> {
    return await fetcher<IProduct>(`${API_URL}/products`, {
        method: "POST",
        body: JSON.stringify(data),
    })
}
