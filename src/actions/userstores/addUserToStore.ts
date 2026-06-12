import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import type { UserRole } from "@/lib/userRoles"

/**
 * Asigna un usuario a una tienda.
 *
 * @param userID - El ID del usuario.
 * @param storeID - El ID de la tienda.
 * @param role - Rol contextual del usuario en la tienda.
 */
export async function addUserToStore(userID: string, storeID: string, role: Exclude<UserRole, "admin"> = "store_manager") {
    return await fetcher(`${API_URL}/userstores`, {
        method: "POST",
        body: JSON.stringify({ userID, storeID, role }),
    })
}
