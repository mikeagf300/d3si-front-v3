import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IStore } from "@/interfaces/stores/IStore"

/**
 * Crea una nueva tienda en el sistema.
 *
 * @param data - Los datos de la nueva tienda.
 */
export async function createStore(data: Partial<IStore>): Promise<IStore> {
    return await fetcher<IStore>(`${API_URL}/stores`, {
        method: "POST",
        body: JSON.stringify(data),
    })
}
