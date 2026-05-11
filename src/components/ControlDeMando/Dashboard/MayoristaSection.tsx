"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface MayoristaStoreItem {
    nombre: string
    ventas: number
}

export default function MayoristaSection({
    topStores,
    salesTotal,
    goalTotal,
}: {
    topStores: MayoristaStoreItem[]
    salesTotal: number
    goalTotal: number
}) {
    const colores = ["#ef4444", "#22c55e", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"]
    const progress = goalTotal > 0 ? Math.min((salesTotal / goalTotal) * 100, 100) : 0
    const circumference = 2 * Math.PI * 56
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

    return (
        <>
            {/* Header Canal Mayorista 
            <div className="lg:col-span-5 lg:col-start-5 lg:row-start-1 lg:row-span-1">
                <Card className="dark:bg-gray-800 flex border-0 shadow-lg">
                    <CardTitle className="text-sm dark:text-white mx-4 mt-4 lg:mt-8">
                        Ranking Ventas Canal Mayorista
                    </CardTitle>
                    <CardContent>
                        <div className="flex gap-2 mt-2 lg:mt-6">
                            <div className="px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium bg-gray-800 text-white dark:bg-white dark:text-gray-800">
                                Período actual
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>*/}

            {/* Botones Ranking y Ticket 
            <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-1">
                <Card className="dark:bg-gray-800 flex border-0 rounded-lg shadow-lg">
                    <CardContent className="flex gap-2 py-2 md:py-4 w-full">
                        <button className="flex-1 px-2 md:px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            Ranking Tiendas
                        </button>
                        <button className="flex-1 px-2 md:px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            Ticket Medio
                        </button>
                    </CardContent>
                </Card>
            </div>*/}

            {/* Ventas por Tienda */}
            <div className="lg:col-span-4 lg:col-start-5 lg:row-start-2 lg:row-span-4">
                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                    <CardContent className="space-y-4 md:space-y-6">
                        <div className="pt-4">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">Ventas por Tienda</h4>
                            <div className="space-y-2">
                                {topStores.length === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No hay ventas mayoristas para el período.
                                    </p>
                                )}
                                {topStores.map((tienda, index) => (
                                    <div
                                        key={tienda.nombre}
                                        className="py-2 px-4 md:px-16 rounded dark:text-white text-center text-xs md:text-sm font-medium"
                                        style={{ backgroundColor: colores[index % colores.length] }}
                                    >
                                        {tienda.nombre} → {tienda.ventas.toLocaleString()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Ventas Totales vs Objetivos */}
            <div className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:row-span-4">
                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-sm my-2 dark:text-white">Ventas Totales vs Objetivos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="56"
                                            stroke="#e5e7eb"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="56"
                                            stroke="#ef4444"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={strokeDasharray}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-lg md:text-xl font-bold dark:text-white text-gray-900">
                                                {salesTotal.toLocaleString("es-CL")}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {goalTotal.toLocaleString("es-CL")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
