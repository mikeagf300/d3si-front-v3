import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Obtiene las tiendas asignadas a un usuario específico.
 *
 * @param id - El ID del usuario (userID).
 */
export async function getStoresByUser(id: string) {
    return await fetcher(`${API_URL}/userstores/${id}`)
}
