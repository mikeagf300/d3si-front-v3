import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IUser } from "@/interfaces/users/IUser"

/**
 * Busca un usuario por su correo electrónico.
 *
 * @param email - El email del usuario a buscar.
 */
export const getUserByEmail = async (email: string): Promise<IUser> => {
    return await fetcher<IUser>(`${API_URL}/users/${email}`)
}
