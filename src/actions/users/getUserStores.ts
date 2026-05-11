import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStore } from "@/interfaces/stores/IStore"
import { normalizeStore } from "@/lib/normalize-user-store"

/**
 * Obtiene todas las tiendas asociadas a un usuario.
 *
 * @param id - El ID del usuario (userID).
 */
export const getUserStores = async (id: string): Promise<IStore[]> => {
    if (!id) return []
    const stores = await fetcher<IStore[]>(`${API_URL}/users/${id}/stores`)
    return Array.isArray(stores) ? stores.map(normalizeStore) : []
}
