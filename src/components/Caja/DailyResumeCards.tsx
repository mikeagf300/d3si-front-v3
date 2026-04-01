"use client"

import React from "react"
import { ISalesResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"
import { CreditCard, HandCoins } from "lucide-react"

export default function DailyResumeCards({ salesResume }: { salesResume?: ISalesResume }) {
    const todaySales = salesResume?.today || {
        total: { count: 0, amount: 0 },
        efectivo: { count: 0, amount: 0 },
        debitoCredito: { count: 0, amount: 0 },
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <CreditCard className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Débito/Crédito</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {todaySales.debitoCredito.count} Productos - ${toPrice(todaySales.debitoCredito.amount)}
                        </p>
                    </div>
                </div>

                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <HandCoins className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Efectivo</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {todaySales.efectivo.count} Productos - ${toPrice(todaySales.efectivo.amount)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
