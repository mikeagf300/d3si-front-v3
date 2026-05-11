"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IStore } from "@/interfaces/stores/IStore"
import { ArrowRightLeft, Loader2, Store, MapPinned, TriangleAlert } from "lucide-react"
import { createTransfer } from "@/actions/transfers/createTransfer"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface Props {
    isOpen: boolean
    onClose: () => void
    stores: IStore[]
}

export function CreateTransferModal({ isOpen, onClose, stores }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [originStoreID, setOriginStoreID] = useState("")
    const [destinationStoreID, setDestinationStoreID] = useState("")

    useEffect(() => {
        if (!isOpen) {
            setOriginStoreID("")
            setDestinationStoreID("")
            setLoading(false)
        }
    }, [isOpen])

    const handleCreate = async () => {
        if (!originStoreID || !destinationStoreID) {
            return toast.error("Selecciona ambas tiendas")
        }
        if (originStoreID === destinationStoreID) {
            return toast.error("La tienda de origen y destino no pueden ser la misma")
        }

        setLoading(true)
        try {
            const res = await createTransfer({ originStoreID, destinationStoreID })
            if (!res.transferID) {
                throw new Error("La transferencia fue creada pero no devolvió un ID válido")
            }
            toast.success("Transferencia creada. Agregue productos ahora.")
            router.push(`/home/transfers/${res.transferID}`)
            onClose()
        } catch (error) {
            toast.error("Error al crear la transferencia")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl overflow-hidden border-slate-200 p-0 dark:border-slate-800 dark:bg-slate-950">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                    <DialogHeader className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/10">
                                <ArrowRightLeft className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-semibold tracking-tight">Nueva Transferencia</DialogTitle>
                                <DialogDescription className="text-sm text-slate-300">
                                    Define la cabecera para mover stock entre dos tiendas antes de agregar productos.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/15">Borrador</Badge>
                            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/15">Origen y destino</Badge>
                            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/15">Stock entre sucursales</Badge>
                        </div>
                    </DialogHeader>
                </div>

                <div className="space-y-8 px-6 py-6">
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                                    <Store className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Tienda de Origen</p>
                                    <p className="text-xs text-slate-500">Desde donde saldrá el stock</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="origin" className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Seleccionar tienda
                                </Label>
                                <Select value={originStoreID} onValueChange={setOriginStoreID}>
                                    <SelectTrigger
                                        id="origin"
                                        className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                                    >
                                        <SelectValue placeholder="Elegir origen..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stores.map((s) => (
                                            <SelectItem key={s.storeID} value={s.storeID}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                <ArrowRightLeft className="h-5 w-5 rotate-90 sm:rotate-0" />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    <MapPinned className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Tienda de Destino</p>
                                    <p className="text-xs text-slate-500">Hacia donde se moverá el stock</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destination" className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Seleccionar tienda
                                </Label>
                                <Select value={destinationStoreID} onValueChange={setDestinationStoreID}>
                                    <SelectTrigger
                                        id="destination"
                                        className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                                    >
                                        <SelectValue placeholder="Elegir destino..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stores.map((s) => (
                                            <SelectItem key={s.storeID} value={s.storeID}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                        <div className="flex items-start gap-3">
                            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>
                                La tienda de origen y destino no pueden ser la misma. Una vez creada, la cabecera pasa al detalle para agregar productos.
                            </p>
                        </div>
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-800" />
                </div>

                <DialogFooter className="border-t border-slate-200 px-6 py-5 dark:border-slate-800">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            Completa ambos campos para habilitar la creación.
                        </p>
                        <div className="flex w-full gap-3 sm:w-auto sm:min-w-[320px]">
                            <Button variant="ghost" onClick={onClose} disabled={loading} className="h-11 flex-1 rounded-xl">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={loading || !originStoreID || !destinationStoreID}
                                className="h-11 flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Crear cabecera
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
