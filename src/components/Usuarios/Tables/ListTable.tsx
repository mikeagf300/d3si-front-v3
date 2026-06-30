"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { useTienda } from "@/stores/tienda.store"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { getAllStores } from "@/actions/stores/getAllStores"
import UsersTable from "./UsersTable"
import StoresTable from "./StoresTable"
import GastosTable from "./GastosTable"
import TableSkeleton from "../../ListTable/TableSkeleton"
import { useAuth } from "@/stores/user.store"

type ViewType = "initial" | "users" | "stores" | "gastos"

interface ListTableProps {
    defaultView?: ViewType
    onViewChange?: (view: ViewType) => void
}

export default function ListTable({ defaultView = "initial", onViewChange }: ListTableProps) {
    const { setStores } = useTienda()
    const { users, setUsers } = useAuth()
    const [currentView, setCurrentView] = useState<ViewType>(defaultView)
    const [isLoading, setIsLoading] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)

    const loadData = useCallback(
        async (view: ViewType) => {
            if (view === "initial" || view === "gastos") return

            setIsLoading(true)
            try {
                if (view === "users") {
                    const usuarios = await getAllUsers()
                    setUsers(usuarios)
                } else if (view === "stores") {
                    const tiendas = await getAllStores()
                    setStores(tiendas)
                }
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setIsLoading(false)
            }
        },
        [setUsers, setStores],
    )
    // Controla si se muestra el skeleton solo si tarda en cargar.
    // Mostrar skeleton si tarda más de 300ms.

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isLoading) {
            timer = setTimeout(() => setShowSkeleton(true), 300)
        } else {
            setShowSkeleton(false)
        }
        return () => clearTimeout(timer)
    }, [isLoading])

    useEffect(() => {
        if (defaultView !== "initial") {
            setCurrentView(defaultView)
            loadData(defaultView)
        }
    }, [defaultView, loadData])

    const handleViewChange = async (view: ViewType) => {
        setCurrentView(view)
        onViewChange?.(view)
        await loadData(view)
    }

    const renderInitialView = () => (
        <div className="bg-white lg:w-fit dark:bg-slate-800 rounded-lg shadow-sm px-6 py-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-2">Panel de Gestión</h3>
                <p className="text-gray-600">Selecciona qué quieres gestionar para ver el listado correspondiente</p>
            </div>

            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                <Button
                    onClick={() => handleViewChange("users")}
                    className="w-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 sm:w-auto"
                >
                    Gestionar Usuarios
                </Button>
                <Button
                    onClick={() => handleViewChange("stores")}
                    className="w-full bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 sm:w-auto"
                >
                    Gestionar Tiendas
                </Button>
                <Button
                    onClick={() => handleViewChange("gastos")}
                    className="w-full bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 sm:w-auto"
                >
                    Gestionar Gastos
                </Button>
            </div>

            {showSkeleton && (
                <div className="mt-8">
                    <TableSkeleton />
                </div>
            )}
        </div>
    )

    const renderContent = () => {
        if (currentView === "initial") {
            return renderInitialView()
        }

        return (
            <div>
                <div className="mb-6 flex flex-col justify-start gap-2 sm:flex-row sm:flex-wrap lg:ml-8">
                    <Button
                        onClick={() => handleViewChange("users")}
                        className={`w-full px-6 py-3 font-medium sm:w-auto ${
                            currentView === "users"
                                ? "bg-blue-600 text-white hover:bg-blue-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Usuarios
                    </Button>
                    <Button
                        onClick={() => handleViewChange("stores")}
                        className={`w-full px-6 py-3 font-medium sm:w-auto ${
                            currentView === "stores"
                                ? "bg-green-600 text-white hover:bg-green-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Tiendas
                    </Button>
                    <Button
                        onClick={() => handleViewChange("gastos")}
                        className={`w-full px-6 py-3 font-medium sm:w-auto ${
                            currentView === "gastos"
                                ? "bg-purple-600 text-white hover:bg-purple-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Gastos
                    </Button>
                </div>

                {showSkeleton ? (
                    <TableSkeleton />
                ) : currentView === "users" ? (
                    <UsersTable users={users} />
                ) : currentView === "stores" ? (
                    <StoresTable />
                ) : (
                    <GastosTable />
                )}
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl lg:text-start text-center lg:ml-8 font-semibold dark:text-white text-gray-800 mb-4">
                {currentView === "users" && "Usuarios Registrados"}
                {currentView === "stores" && "Tiendas Registradas"}
                {currentView === "gastos" && "Gastos Registrados"}
            </h2>
            {renderContent()}
        </div>
    )
}
