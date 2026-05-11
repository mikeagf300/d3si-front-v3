import { IStore } from "@/interfaces/stores/IStore"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { normalizeStore } from "@/lib/normalize-user-store"

/**
 * Obtiene todas las tiendas desde la API.
 *
 * @returns {Promise<IStore[]>} - Promesa que resuelve con un array de objetos `IStore`.
 */
export const getAllStores = async (options?: RequestInit): Promise<IStore[]> => {
    const stores = await fetcher<IStore[]>(`${API_URL}/stores`, options)
    return Array.isArray(stores) ? stores.map(normalizeStore) : []
}

/**
 * Obtiene todas las tiendas de un mismo usuario.
 *
 * @returns {Promise<IStore[]>} - Promesa que resuelve con un array de objetos `IStore`.
 */
export const getUserStores = async (userId: string, options?: RequestInit): Promise<IStore[]> => {
    const stores = await fetcher<IStore[]>(`${API_URL}/users/${userId}/stores`, options)
    return Array.isArray(stores) ? stores.map(normalizeStore) : []
}
