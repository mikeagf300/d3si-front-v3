import Navbar from "@/components/Navbar/Navbar"
import Sidebar from "@/components/Sidebar/Sidebar"
import { AUTH_COOKIE_NAME } from "@/lib/auth-session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!authToken) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen dark:bg-gray-900 bg-gray-100">
            <Suspense fallback={"...cargando"}>
                <Sidebar />
            </Suspense>
            <section className="flex-1 pl-2 lg:p-6 overflow-auto">
                <Navbar />
                {children}
            </section>
        </div>
    )
}
