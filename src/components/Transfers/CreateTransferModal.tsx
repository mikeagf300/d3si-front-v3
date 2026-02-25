"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IStore } from "@/interfaces/stores/IStore"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { createTransfer } from "@/actions/transfers/createTransfer"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
            <DialogContent className="sm:max-w-md dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <ArrowRightLeft className="text-blue-500" />
                        Nueva Transferencia
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="origin" className="text-sm font-semibold">
                            Tienda de Origen
                        </Label>
                        <select
                            id="origin"
                            value={originStoreID}
                            onChange={(e) => setOriginStoreID(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="">Seleccionar...</option>
                            {stores.map((s) => (
                                <option key={s.storeID} value={s.storeID}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 italic">De donde saldrá el stock</p>
                    </div>

                    <div className="flex justify-center py-2 text-gray-300">
                        <ArrowRightLeft size={24} className="rotate-90 sm:rotate-0" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="destination" className="text-sm font-semibold">
                            Tienda de Destino
                        </Label>
                        <select
                            id="destination"
                            value={destinationStoreID}
                            onChange={(e) => setDestinationStoreID(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="">Seleccionar...</option>
                            {stores.map((s) => (
                                <option key={s.storeID} value={s.storeID}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 italic">Hacia donde se moverá el stock</p>
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between items-center gap-4">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="flex-1">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={loading || !originStoreID || !destinationStoreID}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Crear Cabecera
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
