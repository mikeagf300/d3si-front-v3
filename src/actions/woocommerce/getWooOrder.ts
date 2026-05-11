"use server"

import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { wooFetcher } from "@/lib/woocommerce-fetcher"

export const getWooCommerceOrders = async (date: Date): Promise<WooCommerceOrder[]> => {
    try {
        // No mutar el objeto Date recibido (se reutiliza en el caller)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        // obtener día 1
        const after = new Date(date.getFullYear(), date.getMonth(), 1)
        after.setHours(0, 0, 0, 0)

        const params = new URLSearchParams({ before: endOfDay.toISOString(), after: after.toISOString() })
        const orders = await wooFetcher<WooCommerceOrder[]>(`orders?${params.toString()}`)
        if (!Array.isArray(orders)) {
            console.warn("getWooCommerceOrders: La respuesta no es un array:", orders)
            return []
        }
        return orders
    } catch (error) {
        console.error(error)
        return []
    }
}

/**
 * Obtiene todas las órdenes de WooCommerce en un rango de fechas arbitrario.
 * Usa paginación para obtener hasta 100 órdenes por página.
 */
export const getWooOrdersForRange = async (after: Date, before: Date): Promise<WooCommerceOrder[]> => {
    try {
        const afterISO = after.toISOString()
        const beforeISO = before.toISOString()
        const params = new URLSearchParams({
            after: afterISO,
            before: beforeISO,
            per_page: "100",
            page: "1",
        })
        const orders = await wooFetcher<WooCommerceOrder[]>(`orders?${params.toString()}`)
        if (!Array.isArray(orders)) {
            console.warn("getWooOrdersForRange: La respuesta no es un array:", orders)
            return []
        }
        return orders
    } catch (error) {
        console.error("getWooOrdersForRange:", error)
        return []
    }
}

export const getWooSingleOrder = async (saleID: string): Promise<WooCommerceOrder | null> => {
    try {
        const order = await wooFetcher<WooCommerceOrder>(`orders/${saleID}`)
        return order
    } catch (error) {
        console.error(error)
        return null
    }
}
