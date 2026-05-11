"use client"

import React from "react"
import { Building2, FileText, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const iconMap = {
    Building2,
    FileText,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Users,
}

export interface DashboardStat {
    id: string
    icon: keyof typeof iconMap
    label: string
    value: string
    color: string
}

export default function StatisticsGrid({ stats }: { stats: DashboardStat[] }) {
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-2">
                {stats.map((stat) => {
                    const Icon = iconMap[stat.icon as keyof typeof iconMap]
                    return (
                        <Card key={stat.id} className="dark:bg-gray-800 border-0 shadow-lg">
                            <CardContent className="p-2 md:p-3 text-center">
                                <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 ${stat.color}`} />
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="text-lg md:text-2xl font-bold dark:text-white">{stat.value}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
