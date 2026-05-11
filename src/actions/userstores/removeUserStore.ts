import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Elimina una asignación usuario-tienda.
 *
 * @param id - El ID de la relación (o el ID que el backend espere para eliminar la asignación).
 */
export async function removeUserStore(id: string) {
    return await fetcher(`${API_URL}/userstores/${id}`, {
        method: "DELETE",
    })
}
