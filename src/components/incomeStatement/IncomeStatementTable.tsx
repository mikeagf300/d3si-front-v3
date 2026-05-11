"use client"

import { useEffect, useState } from "react"
import { getAllExpenses } from "@/actions/expenses/getAllExpenses"
import { IExpense } from "@/interfaces/expenses/IExpense"
import { Loader2 } from "lucide-react"

const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
]

const toPrice = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

export default function IncomeStatementTable() {
    const [gastos, setGastos] = useState<IExpense[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getAllExpenses()
            .then(setGastos)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-500 text-sm">Cargando gastos...</span>
            </div>
        )
    }

    // Agrupar gastos por mes del año actual
    const currentYear = new Date().getFullYear()
    const rows = MESES.map((mes, idx) => {
        const gastosDelMes = gastos.filter((g) => {
            const fecha = new Date(g.deductibleDate)
            return fecha.getFullYear() === currentYear && fecha.getMonth() === idx
        })
        const totalGastos = gastosDelMes.reduce((acc, g) => acc + g.amount, 0)
        return { mes, gastos: totalGastos }
    })

    const totalAnual = rows.reduce((acc, r) => acc + r.gastos, 0)

    return (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                    Gastos por Mes — {currentYear}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total anual: <span className="font-bold text-red-600">{toPrice(totalAnual)}</span>
                </span>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Gastos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registros</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {rows.map((row, idx) => {
                        const registros = gastos.filter((g) => {
                            const fecha = new Date(g.deductibleDate)
                            return fecha.getFullYear() === currentYear && fecha.getMonth() === idx
                        }).length

                        return (
                            <tr key={row.mes} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.mes}</td>
                                <td className="px-4 py-2 text-red-600 font-semibold">
                                    {row.gastos > 0 ? toPrice(row.gastos) : "—"}
                                </td>
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-300 text-sm">
                                    {registros > 0 ? `${registros} gasto${registros > 1 ? "s" : ""}` : "—"}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <td className="px-4 py-2 font-bold text-gray-800 dark:text-white">Total</td>
                        <td className="px-4 py-2 font-bold text-red-700">{toPrice(totalAnual)}</td>
                        <td className="px-4 py-2 font-bold text-gray-600 dark:text-gray-300">
                            {gastos.length} gasto{gastos.length !== 1 ? "s" : ""}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
