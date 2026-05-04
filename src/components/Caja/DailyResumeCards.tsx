"use client"

import React from "react"
import { ISalesResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"
import { CreditCard, HandCoins, Sparkles, ReceiptText } from "lucide-react"

type ResumeCardProps = {
    label: string
    count: number
    amount: number
    icon: React.ReactNode
    tone: "blue" | "emerald" | "amber"
}

const toneStyles: Record<ResumeCardProps["tone"], string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200",
    emerald:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200",
    amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200",
}

function ResumeCard({ label, count, amount, icon, tone }: ResumeCardProps) {
    return (
        <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{label}</p>
                    <p className="text-2xl font-semibold leading-none">{toPrice(amount)}</p>
                    <p className="text-sm opacity-90">
                        {count} venta{count === 1 ? "" : "s"} hoy
                    </p>
                </div>
                <div className="rounded-full bg-white/70 p-2 shadow-sm dark:bg-black/20">{icon}</div>
            </div>
        </div>
    )
}

export default function DailyResumeCards({ salesResume }: { salesResume?: ISalesResume }) {
    const today = salesResume?.today ?? {
        total: { count: 0, amount: 0 },
        efectivo: { count: 0, amount: 0 },
        debitoCredito: { count: 0, amount: 0 },
    }

    return (
        <div className="w-full">
            <div className="mb-3 flex items-center gap-2 px-1">
                <Sparkles className="h-4 w-4 text-slate-500" />
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Resumen diario</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ResumeCard
                    label="Ventas totales hoy"
                    count={today.total.count}
                    amount={today.total.amount}
                    icon={<ReceiptText className="h-6 w-6 text-slate-700 dark:text-slate-200" />}
                    tone="amber"
                />
                <ResumeCard
                    label="Débito / crédito / web"
                    count={today.debitoCredito.count}
                    amount={today.debitoCredito.amount}
                    icon={<CreditCard className="h-6 w-6 text-blue-700 dark:text-blue-200" />}
                    tone="blue"
                />
                <ResumeCard
                    label="Efectivo"
                    count={today.efectivo.count}
                    amount={today.efectivo.amount}
                    icon={<HandCoins className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />}
                    tone="emerald"
                />
            </div>
        </div>
    )
}
