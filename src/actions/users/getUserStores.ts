import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStore } from "@/interfaces/stores/IStore"

/**
 * Obtiene todas las tiendas asociadas a un usuario.
 *
 * @param id - El ID del usuario (userID).
 */
export const getUserStores = async (id: string): Promise<IStore[]> => {
    return await fetcher<IStore[]>(`${API_URL}/users/${id}/stores`)
}
