import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStore } from "@/interfaces/stores/IStore"

/**
 * Obtiene una tienda por su ID.
 *
 * @param id - El ID de la tienda (storeID).
 */
export async function getStoreById(id: string): Promise<IStore> {
    return await fetcher<IStore>(`${API_URL}/stores/${id}`)
}
