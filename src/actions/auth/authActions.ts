"use server"

import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/auth-session"
import { cookies } from "next/headers"
import { normalizeUser } from "@/lib/normalize-user-store"
import type { IUser } from "@/interfaces/users/IUser"

type AuthResponse = {
    message?: string
    user: IUser
    accessToken: string
}

type RawAuthResponse = {
    message?: string
    user: Parameters<typeof normalizeUser>[0]
    accessToken: string
}

export async function login(email: string, password: string) {
    const auth = await fetcher<RawAuthResponse>(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    const normalized: AuthResponse = {
        ...auth,
        user: normalizeUser(auth.user),
    }

    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, normalized.accessToken, {
        path: "/",
        sameSite: "lax",
        maxAge: AUTH_COOKIE_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
    })

    return normalized
}

export async function checkStatus() {
    const auth = await fetcher<RawAuthResponse>(`${API_URL}/auth/check-status`, {
        method: "GET",
    })
    return {
        ...auth,
        user: normalizeUser(auth.user),
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, "", {
        path: "/",
        sameSite: "lax",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
    })

    return { ok: true }
}
