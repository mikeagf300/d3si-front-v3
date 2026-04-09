import { getSales, getSalesForResume } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { mapWooOrderToSale } from "@/utils/mappers/woocommerceToSale"
import ResumeDebitCreditPayment from "@/components/Caja/DailyResumeCards"
import FilterControls from "@/components/Caja/FilterControls"
import SellButton from "@/components/ui/sell-button"
import ResumeLeftSideChart from "@/components/Caja/ResumeLeftSideChart"
import TotalSalesResumeGraph from "@/components/Caja/TotalSalesResumeGraph"
import ResumeRightSideChart from "@/components/Caja/ResumeRightSideChart"
import SalesTable from "@/components/Caja/SalesTable"
import { salesToResume } from "@/utils/saleToResume"
import { Suspense } from "react"
import SalesAndResumeSkeleton from "@/components/skeletons/SalesAndResume"
import { totalDebitoCredito } from "@/utils/totalsDebitoCredito"
import { getAllPurchaseOrders } from "@/actions/purchase-orders/getAllPurchaseOrders"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChartBarIcon } from "lucide-react"
import { SaleForm } from "@/components/CreateSale/SaleForm"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const CHILE_TZ = "America/Santiago"
const chileYmdFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const getChileYYYYMMDD = (d: Date): string => chileYmdFormatter.format(d)

const isYYYYMMDD = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)

interface SearchParams {
    searchParams: Promise<{
        storeID: string
        date: string
    }>
}

const HomePage = async ({ searchParams }: SearchParams) => {
    const { storeID = "", date = "" } = await searchParams
    const now = new Date()
    const yyyyDate = isYYYYMMDD(date) ? date : getChileYYYYMMDD(now)
    const [year, month, day] = yyyyDate.split("-").map(Number)

    // Date.UTC garantiza mediodía UTC independiente del timezone del servidor.
    // Mediodía UTC siempre cae en el día correcto para Chile.
    const newDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

    if (!storeID) {
        let stores: Awaited<ReturnType<typeof getAllStores>> = []
        try {
            stores = await getAllStores()
        } catch {}
        if (stores.length > 0) {
            redirect(`/home?storeID=${stores[0].storeID}`)
        }
        return null
    }

    let allStores: Awaited<ReturnType<typeof getAllStores>> = []
    try {
        allStores = await getAllStores()
    } catch (error) {
        console.warn("HomePage: No se pudieron obtener las tiendas:", error)
    }
    const isSpecialFilter = ["all", "propias", "consignadas"].includes(storeID)

    // Determinar qué tienda usar para los gráficos (por defecto la primera si es un filtro especial)
    const chartStoreID = isSpecialFilter ? allStores[0]?.storeID : storeID
    // Determinar qué tienda usar para la API de ventas (vacío para traer todas si es especial)
    const apiSalesStoreID = isSpecialFilter ? "" : storeID

    const [sales, resumeSales, wooOrders, resume, allOrders, allProducts] = await Promise.all([
        getSales(apiSalesStoreID || "", yyyyDate),
        getSalesForResume(apiSalesStoreID || "", yyyyDate),
        getWooCommerceOrders(newDate),
        getResume(chartStoreID || "", yyyyDate).catch((err) => {
            console.warn("HomePage: No se pudo obtener el resumen (getResume):", err.message)
            return null
        }),
        getAllPurchaseOrders(),
        getAllProducts(),
    ])
    const wooSales = wooOrders.map(mapWooOrderToSale)

    // Filtrar las ventas para la tabla según el filtro especial
    const tableSales = sales.filter((sale) => {
        if (storeID === "all") return true
        if (storeID === "propias") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isCentralStore === true
        }
        if (storeID === "consignadas") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isCentralStore === false
        }
        return sale.storeID === storeID
    })

    // Las ventas Web (WooCommerce) se consideran "propias"
    const filteredWooSales = storeID === "all" || storeID === "propias" ? wooSales : []

    const allSales = [...tableSales, ...filteredWooSales]

    // Ventas usadas para los resúmenes: mes en curso + últimos 7 días (para que month no quede en 0)
    const resumeLocalSales = resumeSales.filter((sale) => {
        if (storeID === "all") return true
        if (storeID === "propias") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isCentralStore === true
        }
        if (storeID === "consignadas") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isCentralStore === false
        }
        return sale.storeID === storeID
    })

    const allSalesForResume = [...resumeLocalSales, ...filteredWooSales]
    const purchaseOrders: (IPurchaseOrder & { isOrder: true })[] = allOrders
        .filter((order) => {
            if (storeID === "all") return true
            const store = allStores.find((s) => s.storeID === order.storeID)
            if (storeID === "propias") return store?.isCentralStore === true
            if (storeID === "consignadas") return store?.isCentralStore === false
            return order.storeID === storeID
        })
        .map((order) => ({ ...order, isOrder: true }))

    const items = [...allSales, ...purchaseOrders]

    const wooResume = salesToResume(wooSales, newDate)

    // Importante: para los gráficos (resume), usamos solo las ventas de la tienda seleccionada (o la default)
    // y usamos el set mensual (resumeSales) para poder calcular el mes en curso.
    const chartSales = isSpecialFilter ? resumeSales.filter((s) => s.storeID === chartStoreID) : resumeSales

    const localSalesResume = salesToResume(chartSales, newDate)

    // Siempre usamos los datos locales (más completos: mes en curso + últimos 7 días)
    // para sobrescribir los periodos del backend. Así el gauge y demás gráficos nunca quedan en $0.
    const mergedSalesResume = {
        today: localSalesResume.today,
        yesterday: localSalesResume.yesterday,
        last7: localSalesResume.last7,
        month: localSalesResume.month,
    }

    // Construir un IResume completo que siempre tiene datos, incluso si el backend devolvió null.
    const finalResume: import("@/interfaces/sales/ISalesResume").IResume = {
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

    const allSalesResume = totalDebitoCredito([mergedSalesResume, wooResume])

    return (
        <>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                {/* Seccion superior */}

                <div className="flex flex-col sm:flex-row flex-wrap item-center sm:items-start justify-between gap-2">
                    {/* <SellButton /> */}
                    <FilterControls stores={allStores} />
                    <ResumeDebitCreditPayment salesResume={salesToResume(allSalesForResume, newDate)} />
                </div>

                {/* Resúmenes y gráfico */}
                <Suspense fallback={<SalesAndResumeSkeleton />}>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex gap-3 items-center">
                                    <ChartBarIcon /> Panel de estadísticas globales
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="block space-y-6 sm:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                                <ResumeLeftSideChart resume={finalResume} />
                                <TotalSalesResumeGraph resume={finalResume} />
                                <ResumeRightSideChart sales={salesToResume(allSalesForResume, newDate)} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Suspense>

                {/* Modulo para vender */}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SaleForm initialProducts={allProducts} />
                </div>

                {/* Tabla de ventas*/}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SalesTable items={items} />
                </div>
            </div>
        </>
    )
}

export default HomePage
