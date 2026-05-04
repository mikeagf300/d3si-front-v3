"use client"

import { motion } from "framer-motion"
import LoginForm from "@/components/Login/LoginForm"

export default function LoginScreen() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-700"
            >
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">Iniciar sesión</h1>
                <p className="mb-6 text-center text-sm text-gray-500">Acceso administrativo a D3SI Retail</p>
                <LoginForm />
                <p className="mt-6 text-center text-xs text-gray-400">© 2025 D3SI. Todos los derechos reservados.</p>
            </motion.div>
        </main>
    )
}
