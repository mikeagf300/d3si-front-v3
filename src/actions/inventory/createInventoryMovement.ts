import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { ICreateInventoryMovement, IInventoryMovement } from "@/interfaces/inventory/IInventoryMovement"

/**
 * Crea un movimiento de inventario manual.
 * POST /inventory/movements
 *
 * @param payload - Datos del movimiento: storeID, variationID, reason, quantity, newStock, referenceID?
 * @returns Promesa con el movimiento creado.
 */
export async function createInventoryMovement(payload: ICreateInventoryMovement): Promise<IInventoryMovement> {
    return await fetcher<IInventoryMovement>(`${API_URL}/inventory/movements`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
