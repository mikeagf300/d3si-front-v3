import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * @deprecated Use addUserToStore from "@/actions/userstores/addUserToStore"
 */
export const addUserStore = async (userID: string, storeID: string): Promise<void> => {
    await fetcher<void>(`${API_URL}/userstores`, {
        method: "POST",
        body: JSON.stringify({ userID, storeID }),
    })
}
