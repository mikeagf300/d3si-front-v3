import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AUTH_COOKIE_NAME } from "@/lib/auth-session"

export default async function Home() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value

    redirect(authToken ? "/home" : "/login")
}
