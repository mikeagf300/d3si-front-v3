"use client"

import { useState } from "react"
import { ITransfer, ITransferItem } from "@/interfaces/transfers/ITransfer"
import { IProduct } from "@/interfaces/products/IProduct"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Trash2, CheckCircle2, Loader2, Package, ArrowRight, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { addTransferItem } from "@/actions/transfers/addTransferItem"
import { completeTransfer } from "@/actions/transfers/completeTransfer"
import { toast } from "sonner"
import Image from "next/image"
import { Label } from "recharts"

interface Props {
    initialTransfer: ITransfer
    products: IProduct[]
}

export default function TransferDetailWrapper({ initialTransfer, products }: Props) {
    const router = useRouter()
    const [transfer, setTransfer] = useState(initialTransfer)
    const [loadingComplete, setLoadingComplete] = useState(false)
    const [addingItem, setAddingItem] = useState(false)

    // Búsqueda de productos
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedVariation, setSelectedVariation] = useState<{
        variationID: string
        sku: string
        name: string
    } | null>(null)
    const [quantity, setQuantity] = useState("1")

    const filteredVariations =
        searchTerm.length > 2
            ? products.flatMap((p) =>
                  p.ProductVariations.filter(
                      (v) =>
                          v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  ).map((v) => ({
                      variationID: v.variationID,
                      sku: v.sku,
                      name: p.name,
                      size: v.sizeNumber,
                      stock: v.stockQuantity,
                  })),
              )
            : []

    const handleAddItem = async () => {
        if (!selectedVariation) return
        const qty = parseInt(quantity)
        if (isNaN(qty) || qty <= 0) return toast.error("Cantidad no válida")

        setAddingItem(true)
        try {
            await addTransferItem(transfer.transferID, {
                variationID: selectedVariation.variationID,
                quantity: qty,
            })
            // Refrescar datos (podríamos hacer un refetch o simplemente añadir al estado local)
            // Para simplicidad en este paso, router.refresh() y recargar pero mejor manipulación de estado si fuera posible
            // Como no tenemos delete item en la interfaz por ahora, lo dejamos así.
            window.location.reload() // Fuerza recarga del server component para ver el item nuevo
        } catch (error) {
            toast.error("Error al agregar producto")
        } finally {
            setAddingItem(false)
        }
    }

    const handleComplete = async () => {
        if (transfer.items.length === 0) return toast.error("Agrega al menos un producto")

        setLoadingComplete(true)
        try {
            await completeTransfer(transfer.transferID)
            toast.success("Transferencia completada y stock movido")
            router.push("/home/transfers")
            router.refresh()
        } catch (error) {
            toast.error("Error al completar la transferencia")
        } finally {
            setLoadingComplete(false)
        }
    }

    const isPending = transfer.status === "PENDING"

    return (
        <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push("/home/transfers")}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Transferencia <span className="text-blue-600">#{transfer.transferID?.slice(0, 8) ?? "N/A"}</span>
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Origen: Tienda {transfer.originStoreID?.slice(0, 4) ?? "N/A"}</span>
                            <ArrowRight size={14} />
                            <span>Destino: Tienda {transfer.destinationStoreID?.slice(0, 4) ?? "N/A"}</span>
                        </div>
                    </div>
                </div>

                {isPending && (
                    <Button
                        onClick={handleComplete}
                        disabled={loadingComplete || !Array.isArray(transfer.items) || transfer.items.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                        {loadingComplete ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={18} />}
                        Finalizar y Mover Stock
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                {/* Panel de Selección (Izquierda) */}
                {isPending && (
                    <div className="lg:w-1/3 flex flex-col gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Plus size={18} className="text-blue-500" />
                            Agregar Productos
                        </h2>

                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <Input
                                placeholder="Buscar por nombre o SKU..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {filteredVariations.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {filteredVariations.map((v) => (
                                        <button
                                            key={v.variationID}
                                            onClick={() => {
                                                setSelectedVariation(v)
                                                setSearchTerm("")
                                            }}
                                            className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b last:border-0 border-gray-100 dark:border-slate-800 transition-colors"
                                        >
                                            <p className="font-medium text-sm">
                                                {v.name} - Talla {v.size}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                SKU: {v.sku} | Stock: {v.stock}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedVariation && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-blue-900 dark:text-blue-100">
                                            {selectedVariation.name}
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            SKU: {selectedVariation.sku}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedVariation(null)}
                                        className="h-6 w-6"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">
                                            Cantidad
                                        </Label>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                    <Button
                                        disabled={addingItem}
                                        onClick={handleAddItem}
                                        className="self-end bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {addingItem ? <Loader2 size={16} className="animate-spin" /> : "Agregar"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tabla de Items (Derecha) */}
                <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Package size={18} className="text-gray-400" />
                            Productos en la transferencia
                        </h2>
                        <Badge variant="outline">{Array.isArray(transfer.items) ? transfer.items.length : 0} items</Badge>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Talla</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Cantidad</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(!Array.isArray(transfer.items) || transfer.items.length === 0) ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-20 text-gray-400">
                                            Aún no has agregado productos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transfer.items.map((item) => (
                                        <TableRow key={item.transferItemID}>
                                            <TableCell className="font-medium">
                                                {/* Aquí idealmente mostraríamos el nombre del producto de la variación */}
                                                Variación {item.variationID?.slice(0, 8) ?? "N/A"}
                                            </TableCell>
                                            <TableCell>{item.variation?.sizeNumber || "-"}</TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {item.variation?.sku || "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
