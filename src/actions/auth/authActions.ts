// authActions.ts
import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IUser } from "@/interfaces/users/IUser"

type AuthResponse = {
    message?: string
    user: IUser
    token: string
}

type ErrorMessage = {
    message?: string
    error?: string
}

export async function login(email: string, password: string) {
    return await fetcher<AuthResponse>(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
}

export async function register(name: string, email: string, role: string, password: string) {
    return await fetcher<AuthResponse & ErrorMessage>(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role, password }),
    })
}

export async function checkStatus() {
    return await fetcher<AuthResponse>(`${API_URL}/auth/check-status`, {
        method: "GET",
    })
}
