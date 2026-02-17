import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Asigna un usuario a una tienda.
 *
 * @param userID - El ID del usuario.
 * @param storeID - El ID de la tienda.
 */
export async function addUserToStore(userID: string, storeID: string) {
    return await fetcher(`${API_URL}/userstores`, {
        method: "POST",
        body: JSON.stringify({ userID, storeID }),
    })
}
