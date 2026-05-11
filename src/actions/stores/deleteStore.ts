import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Elimina una tienda por su ID.
 *
 * @param id - El ID de la tienda (storeID).
 */
export async function deleteStore(id: string): Promise<{ message: string }> {
    return await fetcher<{ message: string }>(`${API_URL}/stores/${id}`, {
        method: "DELETE",
    })
}
