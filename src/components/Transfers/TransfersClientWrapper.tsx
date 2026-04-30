"use client"

import { useState } from "react"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { IStore } from "@/interfaces/stores/IStore"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightLeft, Eye, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { CreateTransferModal } from "@/components/Transfers/CreateTransferModal"

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
    const [isModalOpen, setIsModalOpen] = useState(false)

    const getStoreName = (id: string) => stores.find((s) => s.storeID === id)?.name || "Desconocida"

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
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus size={18} />
                    Nueva Transferencia
                </Button>
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
                                            {new Date(t.createdAt).toLocaleDateString()}
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

            <CreateTransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} stores={stores} />
        </div>
    )
}
