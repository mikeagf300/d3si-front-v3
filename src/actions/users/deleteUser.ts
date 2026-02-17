import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Elimina un usuario por su ID.
 *
 * @param id - El ID del usuario (userID).
 */
export const deleteUser = async (id: string): Promise<{ message: string }> => {
    return await fetcher<{ message: string }>(`${API_URL}/users/${id}`, {
        method: "DELETE",
    })
}
