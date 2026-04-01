"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnularSale, anularSale } from "@/actions/sales/anularSale"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"
import { ISaleProduct, ISaleResponse } from "@/interfaces/sales/ISale"

type SelectedProductReturn = {
    key: string
    product: ISaleProduct
    quantityToReturn: number
}

interface AnularVentaModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    sale: ISaleResponse
}

const initialState: AnularSale["nullNote"] = {
    clientEmail: "",
    reason: "",
    type: "DEVOLUCION",
    processedBy: "",
    additionalNotes: "",
    ProductAnulations: [],
}

export function AnularVentaModal({ isOpen, setIsOpen, sale }: AnularVentaModalProps) {
    const { user } = useAuth()
    const [formState, setFormState] = useState(initialState)
    // Estado para manejar los productos seleccionados con la cantidad a devolver
    const [selectedProducts, setSelectedProducts] = useState<SelectedProductReturn[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const hasOkFlag = (value: unknown): value is { ok: boolean } => {
        return typeof value === "object" && value !== null && "ok" in value
    }

    // Sincronizar el estado del formulario con los datos de la venta si ya tiene devoluciones
    useEffect(() => {
        if (isOpen) {
            if (sale.Return) {
                setFormState({
                    clientEmail: sale.Return.clientEmail || "",
                    reason: sale.Return.reason || "",
                    type: sale.Return.type || "DEVOLUCION",
                    processedBy: sale.Return.processedBy || "",
                    additionalNotes: sale.Return.additionalNotes || "",
                    ProductAnulations: [], // No lo usamos directamente en el submit
                })
            } else {
                setFormState(initialState)
            }
            setSelectedProducts([])
            setError(null)
        }
    }, [isOpen, sale])

    const getSaleProductKey = (product: ISaleProduct, fallbackKey: string) => {
        return product.saleProductID || product.variationID || fallbackKey
    }

    const getReturnedQtyForProduct = (product: ISaleProduct) => {
        const saleProductID = product.saleProductID
        const variationID = product.variationID

        const match = sale.Return?.ProductAnulations?.find((a) => {
            if (saleProductID && a.saleProductID) return a.saleProductID === saleProductID
            if (variationID && a.variationID) return a.variationID === variationID
            return false
        })

        return match?.returnedQuantity || 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormState((prev) => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: "GARANTIA" | "DEVOLUCION") => {
        setFormState((prev) => ({ ...prev, type: value }))
    }

    /**
     * 🔄 Maneja la selección de un producto (marcar/desmarcar).
     * Si se selecciona, se añade al estado con la cantidad máxima vendida como cantidad a devolver.
     * Si se deselecciona, se elimina del estado.
     */
    const handleToggleProduct = (product: ISaleProduct, availableQty: number) => {
        const key = getSaleProductKey(product, `${product.variation?.sku || "product"}`)
        setSelectedProducts((prev) => {
            const isSelected = prev.some((p) => p.key === key)
            if (isSelected) {
                // Deseleccionar: eliminar el producto
                return prev.filter((p) => p.key !== key)
            } else {
                // Seleccionar: añadir con la cantidad disponible como valor inicial si es mayor a 0
                const qty = Math.min(1, availableQty)
                return [...prev, { key, product, quantityToReturn: qty }]
            }
        })
    }

    /**
     * 🔢 Maneja el cambio de cantidad a anular para un producto seleccionado.
     */
    const handleProductQuantityChange = (
        product: ISaleProduct,
        newQuantity: number | string | null,
        availableQty: number,
    ) => {
        let finalQuantity: number
        const key = getSaleProductKey(product, `${product.variation?.sku || "product"}`)

        // Validación y ajuste de la cantidad
        if (newQuantity === null || newQuantity === "" || Number(newQuantity) === 0) {
            setSelectedProducts((prev) => prev.filter((p) => p.key !== key))
            return
        } else {
            // Aseguramos que la cantidad esté entre 0 y la cantidad disponible
            const v = Number(newQuantity)
            finalQuantity = Math.max(0, Math.min(v, availableQty))
        }

        setSelectedProducts((prev) => {
            const existingProductIndex = prev.findIndex((p) => p.key === key)

            if (existingProductIndex !== -1) {
                // Si el producto ya estaba seleccionado, actualizamos la cantidad
                const updatedProducts = [...prev]
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantityToReturn: finalQuantity,
                }
                return updatedProducts
            } else if (finalQuantity > 0) {
                // Si no estaba seleccionado lo añadimos
                return [...prev, { key, product, quantityToReturn: finalQuantity }]
            }
            return prev
        })
    }

    // Función para manejar el valor del input, permitiendo valores intermedios (ej. un usuario escribiendo "2")
    const handleQuantityInput = (product: ISaleProduct, rawValue: string, availableQty: number) => {
        const key = getSaleProductKey(product, `${product.variation?.sku || "product"}`)
        if (rawValue === "") {
            setSelectedProducts((prev) => {
                const updated = [...prev]
                const idx = updated.findIndex((p) => p.key === key)
                if (idx !== -1) updated[idx].quantityToReturn = 0
                return updated
            })
            return
        }

        const v = Number(rawValue)
        if (!isNaN(v)) {
            handleProductQuantityChange(product, v, availableQty)
        }
    }

    const handleQuantityBlur = (product: ISaleProduct, rawValue: string, availableQty: number) => {
        const v = Number(rawValue)
        // Validación final (entre 0 y availableQty)
        const clamped = isNaN(v) ? 0 : Math.max(0, Math.min(v, availableQty))
        handleProductQuantityChange(product, clamped, availableQty)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (selectedProducts.length === 0) {
            setError("Debes seleccionar al menos un producto para anular o devolver.")
            toast.error("Selecciona al menos un producto.")
            return
        }

        const processedBy = user?.userID || "Usuario Desconocido"

        const nullNoteData = { ...formState }

        // Calculamos el total de productos devueltos sumando los ya existentes + los nuevos seleccionados
        const returnedProducts = sale.SaleProducts.map((p, index) => {
            const alreadyReturned = getReturnedQtyForProduct(p)
            const key = getSaleProductKey(p, `idx_${index}`)
            const newlySelected = selectedProducts.find((sp) => sp.key === key)?.quantityToReturn || 0

            return {
                saleProductID: p.saleProductID,
                variationID: p.variationID,
                quantity: alreadyReturned + newlySelected,
            }
        }).filter((p) => p.quantity > 0)

        if (returnedProducts.length === 0) {
            setError("Debes seleccionar al menos un producto para anular o devolver.")
            toast.error("Selecciona al menos un producto.")
            return
        }

        const submissionData: AnularSale = {
            saleID: sale.saleID,
            nullNote: {
                ...nullNoteData,
                processedBy,
                returnedProducts,
            },
        }

        console.log("AnularSale payload:", submissionData)

        startTransition(async () => {
            try {
                const result = await anularSale(submissionData)
                // Si el backend devuelve { ok: false } en 200, lo respetamos.
                if (hasOkFlag(result) && result.ok === false) {
                    toast.error("No se pudo anular la venta")
                    return
                }

                toast("Venta anulada correctamente")
                setIsOpen(false)
                router.push("/home")
            } catch (err: any) {
                setError(err.message || "Ocurrió un error al anular la venta.")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Anular Venta</DialogTitle>
                        <DialogDescription>
                            Completa el formulario para procesar la anulación de la venta.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="clientEmail">Email del Cliente</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                placeholder="cliente@example.com"
                                value={formState.clientEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="type">Tipo de Anulación</Label>
                            <Select onValueChange={handleSelectChange} defaultValue={formState.type}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVOLUCION">Devolución</SelectItem>
                                    <SelectItem value="GARANTIA">Garantía</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Lista de productos: permitir seleccionar múltiples con checkbox y cantidad por producto */}
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label>Productos a anular</Label>
                            <div className="max-h-56 overflow-auto border rounded-md p-2">
                                {sale.SaleProducts.map((p, index) => {
                                    const key = getSaleProductKey(p, `idx_${index}`)
                                    const soldQty = p.quantitySold || 1

                                    // Cantidad ya anulada previamente
                                    const returnedQty = getReturnedQtyForProduct(p)

                                    const availableQty = soldQty - returnedQty
                                    const name =
                                        p.variation?.sku || p.variationID || p.saleProductID || "Producto Desconocido"

                                    const selectedProduct = selectedProducts.find((sp) => sp.key === key)
                                    const selected = !!selectedProduct

                                    const quantityValue = selected
                                        ? selectedProduct.quantityToReturn === 0
                                            ? ""
                                            : selectedProduct.quantityToReturn
                                        : 0

                                    return (
                                        <div
                                            key={key}
                                            className="flex flex-col gap-1 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id={`chk_${key}`}
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-30"
                                                        checked={selected}
                                                        onChange={() => handleToggleProduct(p, availableQty)}
                                                        disabled={availableQty <= 0}
                                                    />
                                                    <label
                                                        htmlFor={`chk_${key}`}
                                                        className={`text-sm font-medium ${availableQty <= 0 ? "text-gray-400" : "text-gray-700 dark:text-gray-200"}`}
                                                    >
                                                        {name}
                                                    </label>
                                                </div>
                                                <div className="w-24">
                                                    <input
                                                        aria-label={`Cantidad a anular para ${name}`}
                                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900"
                                                        type="number"
                                                        min={0}
                                                        max={availableQty}
                                                        value={quantityValue}
                                                        onChange={(e) =>
                                                            handleQuantityInput(p, e.target.value, availableQty)
                                                        }
                                                        onBlur={(e) =>
                                                            handleQuantityBlur(p, e.target.value, availableQty)
                                                        }
                                                        disabled={!selected || availableQty <= 0}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-500 px-6 mt-1">
                                                <span>
                                                    Total: <span className="font-semibold">{soldQty}</span>
                                                </span>
                                                <span className="text-red-500">
                                                    Anulados: <span className="font-semibold">{returnedQty}</span>
                                                </span>
                                                <span
                                                    className={
                                                        availableQty > 0
                                                            ? "text-emerald-600 font-semibold"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    Disponibles: {availableQty}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label htmlFor="reason">Motivo Principal</Label>
                            <Textarea
                                id="reason"
                                placeholder="Ej: Producto defectuoso, talla equivocada..."
                                value={formState.reason}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="hidden">
                            <Label htmlFor="processedBy">Procesado Por</Label>
                            <Input id="processedBy" type="hidden" value={user?.name || ""} readOnly disabled />
                        </div>
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label htmlFor="additionalNotes">Notas Adicionales</Label>
                            <Textarea
                                id="additionalNotes"
                                placeholder="Añade cualquier detalle extra aquí..."
                                value={formState.additionalNotes}
                                onChange={handleInputChange}
                            />
                        </div>
                        {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || selectedProducts.length === 0}
                        >
                            {isPending ? "Procesando..." : "Confirmar Anulación"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
