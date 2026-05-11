/**
 * Función utilitaria para realizar peticiones HTTP con `fetch`.
 * Envuelve la función fetch nativa y lanza un error si la respuesta no es exitosa.
 *
 * @template T - Tipo de dato esperado en la respuesta (por ejemplo, un objeto, un array, etc.).
 * @param {string} url - URL a la que se realizará la petición.
 * @param {RequestInit} [options={}] - Opcional. Configuración para la petición (método, headers, body, etc.).
 * @returns {Promise<T>} - Promesa que resuelve con los datos de la respuesta parseados como JSON.
 * @throws {Error} - Lanza un error si la respuesta del servidor no es exitosa (`response.ok` es false).
 *
 * @example
 * const user = await fetcher<User>(`${API_URL}/users/123`);
 */

import { getClientAuthToken } from "@/lib/auth-session"

const getServerToken = async (): Promise<string | null> => {
    try {
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        return cookieStore.get("auth_token")?.value ?? null
    } catch (error) {
        console.error("Error al leer cookies del servidor:", error)
        return null
    }
}

export const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    let token: string | null = null

    if (typeof window === "undefined") {
        token = await getServerToken()
    } else {
        token = getClientAuthToken()
    }

    const headers: HeadersInit = {
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    const response = await fetch(url, {
        ...options,
        headers,
        cache: "no-store",
        next: { revalidate: 0 },
    })

    let data
    try {
        data = await response.json()
    } catch (e) {
        if (!response.ok) {
            throw new Error(`Error en la petición: status ${response.status}`)
        }
        return null as unknown as T
    }

    if (!response.ok) {
        throw new Error(data?.message || data?.error || `Error en la petición HTTP: status ${response.status}`)
    }

    if (data && typeof data === "object" && "statusCode" in data && "data" in data) {
        return data.data as T
    }

    return data as T
}
