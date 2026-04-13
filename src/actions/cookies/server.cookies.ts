"use server"
import { cookies } from "next/headers"

export const getServerCookie = async () => {
    const { get } = await cookies()
    const dark = get("dark")
    if (!dark) return null
    try {
        return JSON.parse(dark.value)
    } catch {
        return dark.value === "true"
    }
}

export const setServerCookie = async (cookie: boolean) => {
    const { set } = await cookies()
    set("dark", JSON.stringify(cookie), { path: "/" })
}
