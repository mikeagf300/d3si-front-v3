"use client"

import { useMemo, useState } from "react"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { IStore } from "@/interfaces/stores/IStore"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, CheckCircle2, Eye, Filter, Plus, RotateCcw, Clock, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { CreateTransferModal } from "@/components/Transfers/CreateTransferModal"
import type { ITransferListFilters, ITransferListMeta, TransferStatus } from "@/interfaces/transfers/ITransfer"
import { buildTransferListQuery, TRANSFER_STATUS_OPTIONS, transferListDefaults } from "@/lib/transfers-query"
import InventoryPagination from "@/components/Inventory/TableSection/InventoryPagination"

interface Props {
    initialTransfers: ITransfer[]
    stores: IStore[]
    initialFilters: ITransferListFilters
    paginationMeta: ITransferListMeta
}

const statusConfig = {
    PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    COMPLETED: { label: "Completada", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
}

const ALL_VALUE = "all"

export default function TransfersClientWrapper({ initialTransfers, stores, initialFilters, paginationMeta }: Props) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [originStoreID, setOriginStoreID] = useState(initialFilters.originStoreID ?? ALL_VALUE)
    const [destinationStoreID, setDestinationStoreID] = useState(initialFilters.destinationStoreID ?? ALL_VALUE)
    const [status, setStatus] = useState(initialFilters.status ?? ALL_VALUE)

    const getStoreName = (id: string) => stores.find((s) => s.storeID === id)?.name || "Desconocida"
    const storeOptions = useMemo(() => [{ storeID: ALL_VALUE, name: "Todas las tiendas" }, ...stores], [stores])
    const currentPage = paginationMeta.page || transferListDefaults.page
    const currentLimit = paginationMeta.limit || transferListDefaults.limit
    const totalPages = Math.max(paginationMeta.totalPages || Math.ceil((paginationMeta.total || 0) / currentLimit), 1)

    const pushFilters = (nextPage?: number) => {
        const parsedFilters: ITransferListFilters = {
            originStoreID: originStoreID !== ALL_VALUE ? originStoreID : undefined,
            destinationStoreID: destinationStoreID !== ALL_VALUE ? destinationStoreID : undefined,
            status: TRANSFER_STATUS_OPTIONS.includes(status as TransferStatus) ? (status as TransferStatus) : undefined,
            page: nextPage ?? transferListDefaults.page,
            limit: transferListDefaults.limit,
        }

        const query = buildTransferListQuery(parsedFilters)
        router.push(query ? `/home/transfers?${query}` : "/home/transfers")
    }

    const applyFilters = () => {
        pushFilters(transferListDefaults.page)
    }

    const clearFilters = () => {
        setOriginStoreID(ALL_VALUE)
        setDestinationStoreID(ALL_VALUE)
        setStatus(ALL_VALUE)
        router.push("/home/transfers")
    }

    const goToPage = (nextPage: number) => {
        pushFilters(nextPage)
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ArrowRightLeft className="text-blue-500" />
                            Transferencias entre Tiendas
                        </h1>
                        <p className="text-sm text-gray-500">Gestiona el movimiento de stock entre sucursales</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 gap-2"
                        >
                            <RotateCcw size={16} />
                            Limpiar filtros
                        </Button>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            <Plus size={18} />
                            Nueva Transferencia
                        </Button>
                    </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-5">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Origen</p>
                        <Select value={originStoreID} onValueChange={setOriginStoreID}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por origen" />
                            </SelectTrigger>
                            <SelectContent>
                                {storeOptions.map((store) => (
                                    <SelectItem key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Destino</p>
                        <Select value={destinationStoreID} onValueChange={setDestinationStoreID}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por destino" />
                            </SelectTrigger>
                            <SelectContent>
                                {storeOptions.map((store) => (
                                    <SelectItem key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Estado</p>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_VALUE}>Todos los estados</SelectItem>
                                {TRANSFER_STATUS_OPTIONS.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {statusConfig[item].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Filter size={16} />
                        <span>
                            Mostrando página {currentPage} de {totalPages} con {paginationMeta.total} registros.
                        </span>
                    </div>
                    <Button onClick={applyFilters} className="gap-2">
                        Aplicar filtros
                    </Button>
                </div>
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
                        {initialTransfers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-400">
                                    No hay transferencias registradas con estos filtros
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
                                            #{t.transferID.slice(0, 8)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {t.originStore?.name || getStoreName(t.originStoreID)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ArrowRightLeft size={14} className="mx-auto text-blue-300" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {t.destinationStore?.name || getStoreName(t.destinationStoreID)}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(t.completedAt || t.createdAt).toLocaleDateString()}
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
                                                Gestionar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <InventoryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        getVisiblePages={() => {
                            const pages: (number | "...")[] = []
                            const maxVisiblePages = 5

                            if (totalPages <= maxVisiblePages) {
                                for (let i = 1; i <= totalPages; i += 1) pages.push(i)
                            } else if (currentPage <= 3) {
                                pages.push(1, 2, 3, 4, "...", totalPages)
                            } else if (currentPage >= totalPages - 2) {
                                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
                            } else {
                                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
                            }

                            return pages
                        }}
                        setCurrentPage={goToPage}
                    />
                </div>
            )}

            <CreateTransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} stores={stores} />
        </div>
    )
}
