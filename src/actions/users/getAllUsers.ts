import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IUser } from "@/interfaces/users/IUser"
import { normalizeUser } from "@/lib/normalize-user-store"

/**
 * Obtiene todos los usuarios desde la API.
 * Realiza una petición GET a la ruta `/users` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<IUser[]>} - Promesa que resuelve con un array de objetos `IUser`.
 * 😊
 * @example
 * const users = await getAllusers();
 */

export const getAllUsers = async (options?: RequestInit): Promise<IUser[]> => {
    const users = await fetcher<IUser[]>(`${API_URL}/users`, options)
    return Array.isArray(users) ? users.map(normalizeUser) : []
}
