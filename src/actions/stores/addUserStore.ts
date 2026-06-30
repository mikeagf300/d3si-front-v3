import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import type { StoreUserRoleValue } from "@/lib/storeUserRoles"

/**
 * @deprecated Use addUserToStore from "@/actions/userstores/addUserToStore"
 */
export const addUserStore = async (userID: string, storeID: string, role?: StoreUserRoleValue): Promise<void> => {
    await fetcher<void>(`${API_URL}/userstores`, {
        method: "POST",
        body: JSON.stringify({ userID, storeID, role }),
    })
}
