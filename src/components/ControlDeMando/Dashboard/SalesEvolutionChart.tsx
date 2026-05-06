"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, CartesianGrid, AreaChart, Area } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    presencial: {
        label: "Canal Presencial",
        color: "#22c55e",
    },
    mayorista: {
        label: "Canal Mayorista",
        color: "#f97316",
    },
    web: {
        label: "Canal Web",
        color: "#3b82f6",
    },
}

export interface SalesEvolutionPoint {
    mes: string
    presencial: number
    mayorista: number
    web: number
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })

export default function SalesEvolutionChart({
    data,
    mayoristaShare,
    webShare,
    webTotal,
    mayoristaTotal,
}: {
    data: SalesEvolutionPoint[]
    mayoristaShare: number
    webShare: number
    webTotal: number
    mayoristaTotal: number
}) {
    return (
        <div className="lg:col-span-9 lg:row-span-3 relative lg:col-start-4 lg:row-start-5">
            {/* Headers del gráfico - Solo en desktop */}
            <div className="hidden lg:flex lg:absolute lg:-top-20 left-0 text-sm gap-3">
                <div className="flex flex-col text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                    <span className="text-orange-500 font-medium">Canal Mayorista</span>
                    <span className="font-bold dark:text-white text-base">{CLP.format(mayoristaTotal)}</span>
                    <span className="text-gray-500 text-xs">{mayoristaShare}% del total</span>
                </div>
                <div className="flex flex-col text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                    <span className="text-blue-600 font-medium">Canal Web</span>
                    <span className="font-bold dark:text-white text-base">{CLP.format(webTotal)}</span>
                    <span className="text-gray-500 text-xs">{webShare}% del total</span>
                </div>
            </div>
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xs md:text-sm dark:text-white">
                        Evolución de Ventas Totales últimos 12 meses / Meta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer className="h-50 md:h-62.5 w-full" config={chartConfig}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="fillPresencial" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillMayorista" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="mes" tickLine={false} axisLine={false} />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent indicator="dot" labelFormatter={(value) => `Mes: ${value}`} />
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey="presencial"
                                fill="url(#fillPresencial)"
                                stroke="#22c55e"
                                stackId="ventas"
                            />
                            <Area
                                type="monotone"
                                dataKey="mayorista"
                                fill="url(#fillMayorista)"
                                stroke="#f97316"
                                stackId="ventas"
                            />
                            <Area
                                type="monotone"
                                dataKey="web"
                                fill="url(#fillWeb)"
                                stroke="#3b82f6"
                                stackId="ventas"
                            />

                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
