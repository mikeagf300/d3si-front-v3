import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import type { UserRole } from "@/lib/userRoles"

/**
 * @deprecated Use addUserToStore from "@/actions/userstores/addUserToStore"
 */
export const addUserStore = async (
    userID: string,
    storeID: string,
    role: Exclude<UserRole, "admin"> = "store_manager",
): Promise<void> => {
    await fetcher<void>(`${API_URL}/userstores`, {
        method: "POST",
        body: JSON.stringify({ userID, storeID, role }),
    })
}
