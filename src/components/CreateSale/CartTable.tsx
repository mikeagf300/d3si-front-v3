import { useSaleStore } from "@/stores/sale.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Input } from "../ui/input"
import { toPrice } from "@/utils/priceFormat"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export const CartTable = () => {
    const { cartItems, actions } = useSaleStore()
    const { removeProduct, updateQuantity } = actions

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">El carrito está vacío</p>
                <p>Agrega productos para comenzar una venta.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto mb-6 rounded-lg border ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">Producto</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cartItems.map((item) => (
                        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50" key={item.storeProductID}>
                            <TableCell className="flex items-center gap-3 p-2">
                                {item.productImage && (
                                    <Image
                                        width={100}
                                        height={100}
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                )}
                                <span>
                                    {item.productName} - {item.sizeNumber}
                                </span>
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <div>
                                    <Input
                                        title="Cantidad"
                                        type="number"
                                        min={0}
                                        max={item.stockQuantity}
                                        value={item.quantity}
                                        onWheel={(e) => {
                                            e.currentTarget.blur()
                                        }}
                                        onChange={(e) => {
                                            if (item.stockQuantity === 0) {
                                                return toast.error("Stock agotado, solicite a central")
                                            }
                                            updateQuantity(item.storeProductID, Number(e.target.value))
                                        }}
                                        className="w-16 text-center rounded border border-gray-300 p-1"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">Stock: {item.stockQuantity}</p>
                                </div>
                            </TableCell>

                            <TableCell className="p-2 text-right">
                                {item.finalPrice !== undefined && item.finalPrice < item.priceList ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-400 line-through">
                                            ${toPrice(item.priceList)}
                                        </span>
                                        <span className="text-sm font-bold text-orange-600">
                                            ${toPrice(item.finalPrice)}
                                        </span>
                                        {item.activeOffer?.description && (
                                            <span className="text-[10px] text-orange-500 italic">
                                                {item.activeOffer.description}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span>${toPrice(item.priceList)}</span>
                                )}
                            </TableCell>
                            <TableCell className="p-2 text-right font-semibold">
                                ${toPrice((item.finalPrice ?? item.priceList) * item.quantity)}
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <button
                                    title="Eliminar"
                                    onClick={() => removeProduct(item.storeProductID)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
