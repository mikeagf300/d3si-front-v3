import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { toMonthlyPeriod } from "@/utils/monthPeriod"

/**
 * Actualiza un IUser en la base de datos mediante una petición HTTP PUT.
 * Utiliza la función `fetcher` para manejar la solicitud.
 *
 * Debe incluir el `productID` que será usado para identificar el recurso en la URL.
 *
 * @returns {Promise<number>} - Devuelve el monto guardado si la operación es exitosa.
 *
 * @throws {Error} - En caso de error, se muestra un mensaje en la consola.
 *
 * @example
 * await updateUser = {
    UserID: string,
    storeID: string
}
 */

export async function updateMeta(storeID: string, monto: number, date?: string): Promise<number> {
    const period = toMonthlyPeriod(date)
    console.log({
        targetAmount: monto,
        period,
    })
    const store = await fetcher<unknown>(`${API_URL}/store-monthly-targets/${storeID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            targetAmount: monto,
            period,
        }),
    })

    if (typeof store === "number") return store

    if (store && typeof store === "object" && "targetAmount" in store) {
        const targetAmount = (store as { targetAmount?: unknown }).targetAmount
        if (typeof targetAmount === "number") return targetAmount
        const parsed = Number(targetAmount)
        if (!Number.isNaN(parsed)) return parsed
    }

    return monto
}
