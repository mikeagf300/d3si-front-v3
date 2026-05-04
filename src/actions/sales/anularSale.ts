import { ISendSaleReturn } from "@/interfaces/sales/ISale"
import { updateSaleStatus } from "./updateSaleStatus"

export interface AnularSale {
    saleID: string
    nullNote: ISendSaleReturn
    // Opcional: información del producto específico a devolver/anular
    productToReturn?: {
        storeProductID?: string
        saleProductID?: string
        variationID?: string
        quantity: number
    }
}

/**
 * Anula una venta usando el contrato documentado por backend.
 * Fallback: PATCH /sales/:id/status
 */
export const anularSale = async (details: AnularSale) => {
    console.warn(
        "anularSale: backend JSON no expone un flujo de devoluciones, usando PATCH /sales/{id}/status como fallback.",
        details,
    )
    return updateSaleStatus(details.saleID, { status: "Anulado" })
}
