import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import type { IUserStoreRelation } from "@/interfaces/common/IUserStoreRelation"

/**
 * Obtiene todas las relaciones usuario-tienda del sistema.
 */
export async function getAllUserStores(): Promise<IUserStoreRelation[]> {
    const userStores = await fetcher<IUserStoreRelation[]>(`${API_URL}/userstores`)
    return Array.isArray(userStores) ? userStores : []
}
