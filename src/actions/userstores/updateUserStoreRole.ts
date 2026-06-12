import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import type { UserRole } from "@/lib/userRoles"

export async function updateUserStoreRole(userStoreID: string, role: Exclude<UserRole, "admin">) {
    return await fetcher(`${API_URL}/userstores/${userStoreID}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    })
}
