import React from "react"

interface Props {
    cantidadTotalProductos: number
    fecha: string
    paymentType?: string
    status?: string
    total?: number
}

export default function SaleMainInfo({ cantidadTotalProductos, fecha, paymentType, status, total }: Props) {
    return (
        <>
            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Número de productos solicitados */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            N° Productos solicitados
                        </span>
                    </div>
                    <p className="text-lg font-semibold">{cantidadTotalProductos}</p>
                </div>

                {/* Fecha de emisión */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha de emisión</span>
                    </div>
                    <p className="text-lg font-semibold">{fecha}</p>
                </div>

                {/* Tipo de pago */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de Pago</span>
                    </div>
                    <p className="text-lg font-semibold">{paymentType || "N/A"}</p>
                </div>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Estado del pago
                    </label>
                    <p className="text-lg font-semibold">{status || "N/A"}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Descuento ($)
                    </label>
                    <p className="text-lg font-semibold">0</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total</label>
                    <p className="text-lg font-semibold">
                        {typeof total === "number" ? total.toLocaleString("es-CL") : "N/A"}
                    </p>
                </div>
            </div>
        </>
    )
}
