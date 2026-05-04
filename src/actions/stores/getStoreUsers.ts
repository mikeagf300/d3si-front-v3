import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IUser } from "@/interfaces/users/IUser"
import { normalizeUser } from "@/lib/normalize-user-store"

/**
 * Obtiene todos los usuarios asociados a una tienda.
 *
 * @param id - El ID de la tienda (storeID).
 */
export async function getStoreUsers(id: string): Promise<IUser[]> {
    const users = await fetcher<IUser[]>(`${API_URL}/stores/${id}/users`)
    return Array.isArray(users) ? users.map(normalizeUser) : []
}
