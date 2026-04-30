"use client"

import { useEffect, useState } from "react"
import { IProduct } from "@/interfaces/products/IProduct"
import { ITransfer } from "@/interfaces/transfers/ITransfer"
import { addTransferItem } from "@/actions/transfers/addTransferItem"
import { completeTransfer } from "@/actions/transfers/completeTransfer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpDown,
    CheckCircle2,
    Info,
    Loader2,
    Package,
    Plus,
    Search,
    Sparkles,
    Store,
    Trash2,
} from "lucide-react"

interface Props {
    initialTransfer: ITransfer
    products: IProduct[]
}

type SelectedVariation = {
    variationID: string
    sku: string
    name: string
    size: string
    stock: number
}

export default function TransferDetailWrapper({ initialTransfer, products }: Props) {
    const router = useRouter()
    const [transfer, setTransfer] = useState(initialTransfer)
    const [loadingComplete, setLoadingComplete] = useState(false)
    const [addingItem, setAddingItem] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedVariation, setSelectedVariation] = useState<SelectedVariation | null>(null)
    const [quantity, setQuantity] = useState("1")

    useEffect(() => {
        setTransfer(initialTransfer)
    }, [initialTransfer])

    const variationCatalog = products.flatMap((product) =>
        product.ProductVariations.map((variation) => ({
            productID: product.productID,
            productName: product.name,
            variationID: variation.variationID,
            sku: variation.sku,
            size: variation.sizeNumber,
            stock:
                variation.StoreProducts?.find((storeProduct) => storeProduct.storeID === transfer.originStoreID)?.quantity ??
                variation.stockQuantity,
        })),
    )

    const variationIndex = new Map(variationCatalog.map((variation) => [variation.variationID, variation]))
    const totalUnits = transfer.items.reduce((sum, item) => sum + item.quantity, 0)
    const completedAt = transfer.completedAt ? new Date(transfer.completedAt).toLocaleString() : null
    const isPending = transfer.status === "PENDING"
    const isCompleted = transfer.status === "COMPLETED"

    const filteredVariations =
        searchTerm.trim().length > 2
            ? variationCatalog.filter((variation) => {
                  const query = searchTerm.toLowerCase()
                  return variation.sku.toLowerCase().includes(query) || variation.productName.toLowerCase().includes(query)
              })
            : []

    const statusBadge =
        transfer.status === "PENDING"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            : transfer.status === "COMPLETED"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"

    const handleAddItem = async () => {
        if (!selectedVariation) return

        const qty = Number.parseInt(quantity, 10)
        if (Number.isNaN(qty) || qty <= 0) return toast.error("Cantidad no válida")
        if (qty > selectedVariation.stock) return toast.error("La cantidad supera el stock disponible en origen")

        setAddingItem(true)
        try {
            const newItem = await addTransferItem(transfer.transferID, {
                variationID: selectedVariation.variationID,
                quantity: qty,
            })

            setTransfer((current) => ({
                ...current,
                items: [...current.items, newItem],
            }))
            setSelectedVariation(null)
            setQuantity("1")
            setSearchTerm("")
            toast.success("Producto agregado a la transferencia")
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
            const updatedTransfer = await completeTransfer(transfer.transferID)
            setTransfer(updatedTransfer)
            toast.success("Transferencia completada y stock movido")
            router.push("/home/transfers")
            router.refresh()
        } catch (error) {
            toast.error("Error al completar la transferencia")
        } finally {
            setLoadingComplete(false)
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
            <Card className="relative overflow-hidden border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />
                <CardContent className="relative p-6 lg:p-7">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push("/home/transfers")}
                                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                <ArrowLeft size={18} />
                            </Button>

                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                        <Sparkles size={14} />
                                        Transferencia de stock
                                    </div>
                                    <Badge className={statusBadge}>
                                        {transfer.status === "PENDING"
                                            ? "Pendiente"
                                            : transfer.status === "COMPLETED"
                                              ? "Completada"
                                              : "Cancelada"}
                                    </Badge>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70">
                                        #{transfer.transferID.slice(0, 8)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Movimiento entre tiendas</h1>
                                    <p className="max-w-2xl text-sm leading-6 text-slate-300">
                                        Define la cabecera, agrega variaciones y cierra la transferencia cuando el stock físico ya se
                                        movió entre origen y destino.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                        <Store size={14} />
                                        Origen: {transfer.originStore?.name || `Tienda ${transfer.originStoreID.slice(0, 4)}`}
                                    </span>
                                    <ArrowRight size={14} className="text-slate-500" />
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                        <Store size={14} />
                                        Destino: {transfer.destinationStore?.name || `Tienda ${transfer.destinationStoreID.slice(0, 4)}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-stretch gap-3 xl:min-w-80">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Items</p>
                                    <p className="mt-2 text-2xl font-semibold">{transfer.items.length}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Unidades</p>
                                    <p className="mt-2 text-2xl font-semibold">{totalUnits}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Fechas</p>
                                <div className="mt-2 space-y-1 text-sm text-slate-200">
                                    <p>Creada: {new Date(transfer.createdAt).toLocaleString()}</p>
                                    <p>{completedAt ? `Completada: ${completedAt}` : "Pendiente de cierre"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
                {isPending ? (
                    <Card className="flex min-h-0 flex-col border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader className="space-y-3 border-b border-slate-100 pb-5 dark:border-slate-800">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Plus size={18} className="text-blue-500" />
                                        Agregar productos
                                    </CardTitle>
                                    <CardDescription>
                                        Busca por SKU o nombre y añade cantidades desde la tienda origen.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="rounded-full">
                                    {variationCatalog.length} variaciones
                                </Badge>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Buscar por nombre o SKU..."
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 dark:border-slate-800 dark:bg-slate-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-0">
                            <div className="px-6 pt-5">
                                {filteredVariations.length > 0 ? (
                                    <ScrollArea className="h-56 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="space-y-2">
                                            {filteredVariations.map((v) => (
                                                <button
                                                    key={v.variationID}
                                                    onClick={() => {
                                                        setSelectedVariation({
                                                            variationID: v.variationID,
                                                            sku: v.sku,
                                                            name: v.productName,
                                                            size: v.size,
                                                            stock: v.stock,
                                                        })
                                                        setSearchTerm("")
                                                    }}
                                                    className="group flex w-full items-start justify-between gap-4 rounded-xl border border-transparent bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 dark:bg-slate-950 dark:hover:border-blue-900/50 dark:hover:bg-slate-900"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                            {v.productName}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Talla {v.size || "-"} · SKU {v.sku}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="shrink-0 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    >
                                                        Stock origen {v.stock}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="max-w-xs space-y-2">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                                <Search size={18} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                Busca una variación para agregarla a esta transferencia
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Usa nombre del producto o SKU. Se mostrarán solo coincidencias desde la tienda origen.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="mx-6 w-auto bg-slate-200 dark:bg-slate-800" />

                            <div className="px-6 pb-6">
                                {selectedVariation ? (
                                    <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm dark:border-blue-900/50 dark:from-blue-950/35 dark:via-slate-950 dark:to-slate-900">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full border-blue-200 text-blue-700 dark:border-blue-900/50 dark:text-blue-300"
                                                    >
                                                        Seleccionado
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">
                                                        Origen: {transfer.originStore?.name || transfer.originStoreID.slice(0, 8)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedVariation.name}</h3>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    <Badge variant="outline" className="rounded-full">
                                                        Talla {selectedVariation.size || "-"}
                                                    </Badge>
                                                    <Badge variant="outline" className="rounded-full">
                                                        SKU {selectedVariation.sku}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    >
                                                        Stock {selectedVariation.stock}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedVariation(null)}
                                                className="rounded-full text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:hover:bg-slate-800"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,160px)_auto]">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                                    Cantidad
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    min="1"
                                                    max={selectedVariation.stock}
                                                    className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    disabled={addingItem || selectedVariation.stock <= 0}
                                                    onClick={handleAddItem}
                                                    className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
                                                >
                                                    {addingItem ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Plus size={16} />
                                                            Agregar a la transferencia
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                                            <Info size={14} className="mt-0.5 shrink-0" />
                                            <p>
                                                La validación visual bloquea cantidades sobre el stock disponible en origen, pero el backend sigue
                                                siendo la fuente de verdad.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-44 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="max-w-xs space-y-2">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                Selecciona una variación para preparar la salida.
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Después podrás cerrar la transferencia y mover el stock físicamente.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex min-h-0 flex-col border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                Transferencia cerrada
                            </CardTitle>
                            <CardDescription>
                                Esta transferencia ya fue completada. El detalle queda como historial operativo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estado final</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Completada</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {completedAt ? `Completada el ${completedAt}` : "Sin fecha de cierre disponible"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Detalle</p>
                                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p>Origen: {transfer.originStore?.name || `Tienda ${transfer.originStoreID.slice(0, 4)}`}</p>
                                    <p>Destino: {transfer.destinationStore?.name || `Tienda ${transfer.destinationStoreID.slice(0, 4)}`}</p>
                                    <p>Items transferidos: {transfer.items.length}</p>
                                    <p>Unidades totales: {totalUnits}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="min-h-0 border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <CardHeader className="space-y-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package size={18} className="text-slate-500" />
                                    Productos en la transferencia
                                </CardTitle>
                                <CardDescription>
                                    Inventario comprometido en este borrador y su trazabilidad por variación.
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="rounded-full">
                                    {transfer.items.length} líneas
                                </Badge>
                                <Badge variant="outline" className="rounded-full">
                                    {totalUnits} unidades
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="rounded-full border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    {isPending ? "Editable" : isCompleted ? "Solo lectura" : "Histórico"}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="min-h-0 p-0">
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                {transfer.items.length === 0 ? (
                                    <div className="flex min-h-[18rem] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="max-w-sm space-y-3">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                                <ArrowUpDown size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    Aún no hay productos agregados
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Busca una variación en el panel lateral y suma las cantidades a transferir.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                        <Table>
                                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                                <TableRow className="border-slate-200 dark:border-slate-800">
                                                    <TableHead className="w-[36%]">Producto</TableHead>
                                                    <TableHead>Talla</TableHead>
                                                    <TableHead>SKU</TableHead>
                                                    <TableHead className="text-right">Cantidad</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transfer.items.map((item) => {
                                                    const variation = variationIndex.get(item.variationID)
                                                    return (
                                                        <TableRow key={item.transferItemID} className="border-slate-100 dark:border-slate-800">
                                                            <TableCell className="py-4">
                                                                <div className="space-y-1">
                                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                                        {variation?.productName || `Variación ${item.variationID.slice(0, 8)}`}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        ID: {item.transferItemID.slice(0, 8)}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-slate-600 dark:text-slate-300">
                                                                {item.variation?.sizeNumber || variation?.size || "-"}
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs text-slate-500">
                                                                {item.variation?.sku || variation?.sku || "-"}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge className="rounded-full border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
                                                                    {item.quantity}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {isPending && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Listo para cerrar la transferencia</p>
                            <p className="text-sm text-slate-500">
                                Revisa las líneas agregadas y confirma el movimiento físico cuando el stock ya salió del origen.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleComplete}
                        disabled={loadingComplete || transfer.items.length === 0}
                        className="h-11 rounded-xl bg-emerald-600 px-5 text-white hover:bg-emerald-700"
                    >
                        {loadingComplete ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={18} />}
                        Finalizar y mover stock
                    </Button>
                </div>
            )}
        </div>
    )
}
