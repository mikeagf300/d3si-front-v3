import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { PaymentStatus } from "@/interfaces/sales/ISale"

/**
 * Actualiza el estado de una venta específica.
 * PATCH /sales/:id/status
 *
 * @param id - El ID de la venta.
 * @param status - El nuevo estado de la venta (e.g., "Pagado", "Anulado").
 */
export const updateSaleStatus = async (id: string, status: PaymentStatus) => {
    try {
        return await fetcher(`${API_URL}/sales/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        })
    } catch (error) {
        console.error(`Error updating status for sale ${id}:`, error)
        throw error
    }
}
