"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

interface FinancialData {
    periodo: string
    ventas: number
    costoVentas: number
    gastosVenta: number
    gastosAdministracion: number
    gastosFinancieros: number
    otrosIngresos: number
    impuestos: number
}

export default function ResultsPanel() {
    const [data, setData] = useState<FinancialData | null>(null)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const res = await fetcher<FinancialData>(`${API_URL}/home?date=&storeID=`)
                if (mounted) setData(res)
            } catch (err) {
                console.warn("ResultsPanel: error fetching financial data", err)
                if (mounted) setData(null)
            }
        }
        fetchData()
        return () => {
            mounted = false
        }
    }, [])

    const periodo = data?.periodo || "-"
    const ventas = data?.ventas || 0
    const costoVentas = data?.costoVentas || 0
    const gastosVenta = data?.gastosVenta || 0
    const gastosAdministracion = data?.gastosAdministracion || 0
    const gastosFinancieros = data?.gastosFinancieros || 0
    const otrosIngresos = data?.otrosIngresos || 0
    const impuestos = data?.impuestos || 0

    const utilidadBruta = ventas - costoVentas
    const totalGastosOperacion = gastosVenta + gastosAdministracion + gastosFinancieros
    const utilidadOperacion = utilidadBruta - totalGastosOperacion
    const utilidadAntesImpuestos = utilidadOperacion + otrosIngresos
    const utilidadNeta = utilidadAntesImpuestos - impuestos

    const format = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" })

    const Row = ({ label, value, className = "" }: { label: string; value: string | number; className?: string }) => (
        <div className={`flex justify-between text-sm ${className}`}>
            <span>{label}</span>
            <span className="font-semibold">{typeof value === "number" ? format(value) : value}</span>
        </div>
    )

    return (
        <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 h-full flex flex-col space-y-2 text-gray-800 dark:text-white">
            <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-400">Estado de Resultados</h2>

            <Row label="Periodo" value={periodo} />
            <hr className="my-1 border-gray-300 dark:border-gray-700" />

            <Row label="Ventas" value={ventas} />
            <Row label="(–) Costo de ventas" value={costoVentas} />
            <Row label="= Utilidad bruta" value={utilidadBruta} className="text-blue-700 dark:text-blue-300 mt-1" />

            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Gastos de operación</p>
            <Row label="Gastos de venta" value={gastosVenta} />
            <Row label="Gastos de administración" value={gastosAdministracion} />
            <Row label="Gastos financieros" value={gastosFinancieros} />
            <Row
                label="Total gastos de operación"
                value={totalGastosOperacion}
                className="text-red-600 dark:text-red-400"
            />

            <Row
                label="= Utilidad de operación"
                value={utilidadOperacion}
                className="text-green-600 dark:text-green-300 mt-2"
            />

            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <Row label="Otros ingresos" value={otrosIngresos} />
            <Row
                label="= Utilidad antes de impuestos"
                value={utilidadAntesImpuestos}
                className="text-blue-700 dark:text-blue-300"
            />

            <Row label="(–) Impuestos" value={impuestos} />
            <Row
                label="= Utilidad neta"
                value={utilidadNeta}
                className="text-indigo-700 dark:text-indigo-300 font-bold text-base mt-2"
            />
        </Card>
    )
}
