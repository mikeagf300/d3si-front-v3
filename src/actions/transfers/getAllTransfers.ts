import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ITransfer } from "@/interfaces/transfers/ITransfer"

/**
 * Obtiene todas las transferencias con filtros opcionales.
 * GET /transfers
 */
export async function getAllTransfers(filters?: {
    originStoreID?: string
    destinationStoreID?: string
    status?: string
    startDate?: string
    endDate?: string
}): Promise<ITransfer[]> {
    const params = new URLSearchParams()
    if (filters?.originStoreID) params.append("originStoreID", filters.originStoreID)
    if (filters?.destinationStoreID) params.append("destinationStoreID", filters.destinationStoreID)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)

    const url = `${API_URL}/transfers?${params.toString()}`
    const response = await fetcher<{ data: ITransfer[]; total: number }>(url)

    // El fetcher ya devuelve 'data', pero según el nuevo endpoint es 'data.data'
    // Si el fetcher devuelve el objeto con 'data', extraemos el array de transferencias.
    if (response && response.data) {
        return response.data
    }

    return (response as unknown as ITransfer[]) || []
}
