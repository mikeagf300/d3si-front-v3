"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface WebRankingItem {
    categoria: string
    valor: number
}

export default function WebRankingSection({ items, percentage }: { items: WebRankingItem[]; percentage: number }) {
    const maxValue = Math.max(...items.map((item) => item.valor), 1)

    return (
        <div>
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm dark:text-white">Ranking Ventas Canal Web {percentage}%</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 md:space-y-4">
                        {items.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No hay ventas web para el período.
                            </p>
                        )}
                        {items.map((item) => (
                            <div key={item.categoria} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.categoria}</span>
                                    <span className="text-xs font-medium text-white bg-teal-600 px-2 py-0.5 rounded">
                                        {item.valor.toLocaleString("es-CL")}
                                    </span>
                                </div>
                                <Progress
                                    value={(item.valor / maxValue) * 100}
                                    className="h-2 md:h-3 bg-gray-200 dark:bg-gray-700 [&>div]:bg-orange-400"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
