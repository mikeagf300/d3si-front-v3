import type { Metadata } from "next"
import { Toaster } from "sonner"
import "../styles/globals.css"

export const metadata: Metadata = {
    title: "D3SI App ERP",
    description: "Sistema gestión de inventario, ventas y usuarios",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es-ES" suppressHydrationWarning>
            <head />
            <body className="font-sans antialiased">
                {children}
                <Toaster />
            </body>
        </html>
    )
}
