import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Obtiene todas las relaciones usuario-tienda del sistema.
 */
export async function getAllUserStores() {
    return await fetcher(`${API_URL}/userstores`)
}
