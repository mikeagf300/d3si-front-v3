"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface MayoristaStoreItem {
    nombre: string
    ventas: number
}

const COLORES = ["#ef4444", "#22c55e", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"]

export function StoreRankingCard({ topStores }: { topStores: MayoristaStoreItem[] }) {
    return (
        <Card className="dark:bg-gray-800 border-0 shadow-lg h-full">
            <CardHeader>
                <CardTitle className="text-sm dark:text-white">Ventas por Tienda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {topStores.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No hay ventas mayoristas para el período.
                    </p>
                )}
                {topStores.map((tienda, index) => (
                    <div
                        key={tienda.nombre}
                        className="py-2 px-4 rounded text-white text-center text-xs md:text-sm font-medium"
                        style={{ backgroundColor: COLORES[index % COLORES.length] }}
                    >
                        {tienda.nombre} → {tienda.ventas.toLocaleString("es-CL")}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export function GoalProgressCard({ salesTotal, goalTotal }: { salesTotal: number; goalTotal: number }) {
    const progress = goalTotal > 0 ? Math.min((salesTotal / goalTotal) * 100, 100) : 0
    const circumference = 2 * Math.PI * 56
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`
    const color = progress >= 100 ? "#22c55e" : progress >= 75 ? "#f97316" : "#ef4444"

    return (
        <Card className="dark:bg-gray-800 border-0 shadow-lg h-full">
            <CardHeader>
                <CardTitle className="text-sm dark:text-white">Ventas Totales vs Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-3">
                    <div className="relative w-44 h-44 mx-auto">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="50%" cy="50%" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="56"
                                stroke={color}
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={strokeDasharray}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dasharray 1s ease" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-bold dark:text-white text-gray-900">
                                    {salesTotal.toLocaleString("es-CL")}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    meta {goalTotal.toLocaleString("es-CL")}
                                </p>
                                <p className="text-xs font-semibold mt-0.5" style={{ color }}>
                                    {Math.round(progress)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
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
    return (
        <>
            <StoreRankingCard topStores={topStores} />
            <GoalProgressCard salesTotal={salesTotal} goalTotal={goalTotal} />
        </>
    )
}
