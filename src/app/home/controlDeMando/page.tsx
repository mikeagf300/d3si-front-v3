import DateRangeTabs from "@/components/ControlDeMando/Dashboard/DateRangeTabs"
import MayoristaSection from "@/components/ControlDeMando/Dashboard/MayoristaSection"
import SalesEvolutionChart from "@/components/ControlDeMando/Dashboard/SalesEvolutionChart"
import StatisticsGrid from "@/components/ControlDeMando/Dashboard/StatisticsGrid"
import WebRankingSection from "@/components/ControlDeMando/Dashboard/WebRankingSection"
import GaugeChartSection from "@/components/ControlDeMando/Dashboard/GaugeChartSection"
import React from "react"
import { getSales, getSalesForResume } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import { getAllStores } from "@/actions/stores/getAllStores"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { salesToResume } from "@/utils/saleToResume"
import { getAnulatedProducts } from "@/lib/getAnulatedProducts"
import { toPrice } from "@/utils/priceFormat"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IStore } from "@/interfaces/stores/IStore"

const CHILE_TZ = "America/Santiago"
const chileYmdFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})
const monthLabelFormatter = new Intl.DateTimeFormat("es-CL", {
    timeZone: CHILE_TZ,
    month: "short",
})

const getChileYYYYMMDD = (d: Date): string => chileYmdFormatter.format(d)
const isYYYYMMDD = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)
const getMonthKey = (date: Date): string =>
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
const getMonthLabel = (date: Date): string => {
    const label = monthLabelFormatter.format(date).replace(".", "")
    return label.charAt(0).toUpperCase() + label.slice(1)
}

const getNetSaleAmount = (sale: ISaleResponse): number => {
    if (sale.status !== "Pagado" && sale.status !== "Anulado") return 0

    const nulledProducts = getAnulatedProducts(sale)
    const totalNulledAmount = nulledProducts.reduce(
        (acc, product) => acc + product.quantitySold * Number(product.unitPrice),
        0,
    )
    const amount = sale.total - totalNulledAmount

    if (amount <= 0 && sale.status === "Anulado") return 0
    return amount
}

const filterSalesByScope = (sales: ISaleResponse[], storeID: string, stores: IStore[]) => {
    return sales.filter((sale) => {
        if (!storeID || storeID === "all") return true
        const store = stores.find((item) => item.storeID === sale.storeID) ?? sale.Store
        if (storeID === "propias") return store?.isCentralStore === true
        if (storeID === "consignadas") return store?.isCentralStore === false
        return sale.storeID === storeID
    })
}

const shouldIncludeWebSales = (storeID: string, stores: IStore[]) => {
    if (!storeID || storeID === "all" || storeID === "propias") return true
    if (storeID === "consignadas") return false
    return stores.find((store) => store.storeID === storeID)?.isCentralStore === true
}

export default async function ControlDashboard({
    searchParams,
}: {
    searchParams?: { storeID?: string; date?: string }
}) {
    const storeID = searchParams?.storeID ?? ""
    const dateParam = searchParams?.date ?? ""
    const yyyyDate = isYYYYMMDD(dateParam) ? dateParam : getChileYYYYMMDD(new Date())
    const [year, month, day] = yyyyDate.split("-").map(Number)
    const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    const selectedMonthKey = yyyyDate.slice(0, 7)

    let allStores: Awaited<ReturnType<typeof getAllStores>> = []
    try {
        allStores = await getAllStores()
    } catch (err) {
        console.warn("ControlDashboard: could not fetch stores", err)
    }
    const isSpecialFilter = ["all", "propias", "consignadas"].includes(storeID)
    const chartStoreID = isSpecialFilter ? (allStores[0]?.storeID ?? "") : storeID
    const includeWebSales = shouldIncludeWebSales(storeID, allStores)

    let resume = null
    try {
        resume = await getResume(chartStoreID || "", yyyyDate).catch(() => null)
    } catch (err) {
        console.warn("ControlDashboard: getResume failed", err)
    }

    const [resumeSales, allSalesHistory, monthlyWooOrders] = await Promise.all([
        getSalesForResume(chartStoreID || "", yyyyDate).catch(() => []),
        getSales(isSpecialFilter ? "" : storeID).catch(() => []),
        Promise.all(
            Array.from({ length: 12 }, (_, index) => {
                const date = new Date(Date.UTC(year, month - 1 - index, 12, 12, 0, 0))
                return getWooCommerceOrders(date).catch(() => [])
            }),
        ),
    ])

    const localSalesResume = salesToResume(resumeSales, new Date())
    const mergedSalesResume = {
        today: localSalesResume.today,
        yesterday: localSalesResume.yesterday,
        last7: localSalesResume.last7,
        month: localSalesResume.month,
    }
    const finalResume = {
        metaMensual: resume?.metaMensual ?? null,
        totales: {
            sales: mergedSalesResume,
            orders: resume?.totales?.orders ?? {
                today: { count: 0, amount: 0 },
                yesterday: { count: 0, amount: 0 },
                last7: { count: 0, amount: 0 },
                month: { count: 0, amount: 0 },
            },
        },
    }

    const filteredSalesHistory = filterSalesByScope(allSalesHistory, storeID, allStores)

    const monthRefs = Array.from(
        { length: 12 },
        (_, index) => new Date(Date.UTC(year, month - 12 + index, 12, 12, 0, 0)),
    )
    const evolutionMap = new Map(
        monthRefs.map((date) => [
            getMonthKey(date),
            {
                mes: getMonthLabel(date),
                presencial: 0,
                mayorista: 0,
                web: 0,
            },
        ]),
    )

    filteredSalesHistory.forEach((sale) => {
        const amount = getNetSaleAmount(sale)
        if (amount <= 0) return

        const saleDate = new Date(sale.createdAt)
        const monthKey = getMonthKey(
            new Date(Date.UTC(saleDate.getUTCFullYear(), saleDate.getUTCMonth(), 12, 12, 0, 0)),
        )
        const row = evolutionMap.get(monthKey)
        if (!row) return

        const store = allStores.find((item) => item.storeID === sale.storeID) ?? sale.Store
        if (store?.isCentralStore) {
            row.presencial += amount
            return
        }
        row.mayorista += amount
    })

    monthlyWooOrders.forEach((orders, index) => {
        if (!includeWebSales) return
        const date = new Date(Date.UTC(year, month - 1 - index, 12, 12, 0, 0))
        const monthKey = getMonthKey(date)
        const row = evolutionMap.get(monthKey)
        if (!row) return
        row.web += orders.reduce((acc, order) => acc + Number(order.total || 0), 0)
    })

    const evolutionData = monthRefs.map((date) => evolutionMap.get(getMonthKey(date))!)
    const currentMonthData = evolutionMap.get(selectedMonthKey) ?? evolutionData[evolutionData.length - 1]
    const currentTotalByChannel = currentMonthData.presencial + currentMonthData.mayorista + currentMonthData.web
    const mayoristaShare =
        currentTotalByChannel > 0 ? Math.round((currentMonthData.mayorista / currentTotalByChannel) * 100) : 0
    const webShare = currentTotalByChannel > 0 ? Math.round((currentMonthData.web / currentTotalByChannel) * 100) : 0

    const selectedMonthWooOrders = includeWebSales ? (monthlyWooOrders[0] ?? []) : []
    const webRankingItems = Array.from(
        selectedMonthWooOrders
            .flatMap((order) => order.line_items)
            .reduce((acc, item) => {
                const current = acc.get(item.name) ?? 0
                const itemTotal = Number(item.price || 0) * Number(item.quantity || 0)
                acc.set(item.name, current + itemTotal)
                return acc
            }, new Map<string, number>())
            .entries(),
    )
        .map(([categoria, valor]) => ({ categoria, valor: Math.round(valor) }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 8)

    const selectedMonthMajoristaSales = filteredSalesHistory.filter((sale) => {
        const store = allStores.find((item) => item.storeID === sale.storeID) ?? sale.Store
        const saleDate = new Date(sale.createdAt)
        return (
            store?.isCentralStore === false &&
            getMonthKey(new Date(Date.UTC(saleDate.getUTCFullYear(), saleDate.getUTCMonth(), 12, 12, 0, 0))) ===
                selectedMonthKey
        )
    })

    const majoristaStoreTotals = Array.from(
        selectedMonthMajoristaSales
            .reduce((acc, sale) => {
                const amount = getNetSaleAmount(sale)
                if (amount <= 0) return acc
                const store = allStores.find((item) => item.storeID === sale.storeID) ?? sale.Store
                const storeName = store?.name ?? "Sin tienda"
                acc.set(storeName, (acc.get(storeName) ?? 0) + amount)
                return acc
            }, new Map<string, number>())
            .entries(),
    )
        .map(([nombre, ventas]) => ({ nombre, ventas: Math.round(ventas) }))
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 6)

    const majoristaTotal = majoristaStoreTotals.reduce((acc, item) => acc + item.ventas, 0)
    const totalMonthBilling = finalResume.totales.sales.month.total.amount + finalResume.totales.orders.month.amount
    const stats = [
        {
            id: "depositos",
            icon: "Building2" as const,
            label: "Depósitos",
            value: `$${toPrice(finalResume.totales.sales.month.efectivo.amount)}`,
            color: "text-orange-500",
        },
        {
            id: "boletas",
            icon: "FileText" as const,
            label: "Boletas Emitidas",
            value: String(finalResume.totales.sales.month.total.count),
            color: "text-orange-500",
        },
        {
            id: "facturas",
            icon: "FileText" as const,
            label: "Facturas Emitidas",
            value: String(finalResume.totales.orders.month.count),
            color: "text-gray-400",
        },
        {
            id: "facturacion",
            icon: "DollarSign" as const,
            label: "Facturación",
            value: `$${toPrice(totalMonthBilling)}`,
            color: "text-orange-500",
        },
        {
            id: "ventas-web",
            icon: "ShoppingCart" as const,
            label: "Ventas Web",
            value: String(selectedMonthWooOrders.length),
            color: "text-orange-500",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <div className="flex-1 w-full flex flex-col">
                <div className="lg:p-3 md:p-6">
                    {/* Header con fechas y tabs */}
                    <DateRangeTabs />

                    {/* Grid principal - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 md:gap-6">
                        {/* Columna izquierda - Estadísticas */}
                        <StatisticsGrid stats={stats} />

                        {/* Gráfico de evolución */}
                        <SalesEvolutionChart data={evolutionData} mayoristaShare={mayoristaShare} webShare={webShare} />
                    </div>

                    {/* Segundo grid - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-5 gap-4 md:gap-8 mt-6">
                        {/* Ranking Ventas Canal Web */}
                        <WebRankingSection items={webRankingItems} percentage={webShare} />

                        {/* Gauge chart (Ventas / Meta) */}
                        <GaugeChartSection resume={finalResume} />

                        {/* Sección Mayorista */}
                        <MayoristaSection
                            topStores={majoristaStoreTotals}
                            salesTotal={majoristaTotal}
                            goalTotal={finalResume.metaMensual?.meta ?? 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
