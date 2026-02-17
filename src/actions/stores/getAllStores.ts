import { IStore } from "@/interfaces/stores/IStore"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todas las tiendas desde la API.
 *
 * @returns {Promise<IStore[]>} - Promesa que resuelve con un array de objetos `IStore`.
 */
export const getAllStores = async (): Promise<IStore[]> => {
    return await fetcher<IStore[]>(`${API_URL}/stores`)
}
