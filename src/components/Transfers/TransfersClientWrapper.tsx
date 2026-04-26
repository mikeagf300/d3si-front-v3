"use client"

import { useState } from "react"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { IStore } from "@/interfaces/stores/IStore"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightLeft, Eye, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreateTransferModal } from "@/components/Transfers/CreateTransferModal"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface Props {
    initialTransfers: ITransfer[]
    stores: IStore[]
}

const statusConfig = {
    PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    COMPLETED: { label: "Completada", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function TransfersClientWrapper({ initialTransfers, stores }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Valores actuales de los filtros desde la URL
    const currentOrigin = searchParams.get("originStoreID") || "all"
    const currentDest = searchParams.get("destinationStoreID") || "all"
    const currentStatus = searchParams.get("status") || "all"

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push(pathname)
    }

    const getStoreName = (id: string, storeObj?: any) => {
        if (storeObj?.name) return storeObj.name
        return stores.find((s) => s.storeID === id)?.name || "Desconocida"
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-500" />
                        Transferencias entre Tiendas
                    </h1>
                    <p className="text-sm text-gray-500">Gestiona el movimiento de stock entre sucursales</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    <Plus size={18} />
                    Nueva Transferencia
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                    <Filter size={14} />
                    Filtros
                </div>

                <div className="min-w-[180px]">
                    <Select value={currentOrigin} onValueChange={(v) => updateFilter("originStoreID", v)}>
                        <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 h-9">
                            <SelectValue placeholder="Origen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Orígenes</SelectItem>
                            {stores.map((s) => (
                                <SelectItem key={s.storeID} value={s.storeID}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-w-[180px]">
                    <Select value={currentDest} onValueChange={(v) => updateFilter("destinationStoreID", v)}>
                        <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 h-9">
                            <SelectValue placeholder="Destino" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Destinos</SelectItem>
                            {stores.map((s) => (
                                <SelectItem key={s.storeID} value={s.storeID}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-w-[150px]">
                    <Select value={currentStatus} onValueChange={(v) => updateFilter("status", v)}>
                        <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 h-9">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Estados</SelectItem>
                            <SelectItem value="PENDING">Pendiente</SelectItem>
                            <SelectItem value="COMPLETED">Completada</SelectItem>
                            <SelectItem value="CANCELLED">Cancelada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(currentOrigin !== "all" || currentDest !== "all" || currentStatus !== "all") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1 h-9"
                    >
                        <X size={14} />
                        Limpiar
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-slate-800">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead className="text-center">
                                <ArrowRightLeft size={16} className="mx-auto text-gray-400" />
                            </TableHead>
                            <TableHead>Destino</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!Array.isArray(initialTransfers) || initialTransfers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-400">
                                    No hay transferencias registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialTransfers.map((t) => {
                                const cfg = statusConfig[t.status] || statusConfig.PENDING
                                return (
                                    <TableRow
                                        key={t.transferID}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <TableCell className="font-mono text-xs text-gray-500">
                                            #{t.transferID?.slice(0, 8) ?? "N/A"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {getStoreName(t.originStoreID ?? "", t.originStore)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ArrowRightLeft size={14} className="mx-auto text-blue-300" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {getStoreName(t.destinationStoreID ?? "", t.destinationStore)}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${cfg.color} border-none flex items-center gap-1 w-fit`}>
                                                <cfg.icon size={12} />
                                                {cfg.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/home/transfers/${t.transferID}`)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Eye size={18} className="mr-1" />
                                                Ver detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateTransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} stores={stores} />
        </div>
    )
}
