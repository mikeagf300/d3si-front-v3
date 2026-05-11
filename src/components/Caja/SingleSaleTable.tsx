import { toPrice } from "@/utils/priceFormat"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ISaleProduct } from "@/interfaces/sales/ISale"

export default function SingleSaleTable({ products }: { products: ISaleProduct[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-800">
                    <TableHead>#</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Total Neto</TableHead>
                    <TableHead>Total con IVA</TableHead>
                    <TableHead align="center">Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((p, i) => {
                    const unitPrice = Number(p.unitPrice)
                    const lineSubtotal = Number(p.subtotal ?? unitPrice * p.quantitySold)
                    const label =
                        (p.variation?.sku ?? `${p.variation?.color ?? ""} ${p.variation?.size ?? ""}`.trim()) ||
                        "Producto"
                    return (
                        <TableRow
                            key={p.saleProductID}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{label}</TableCell>
                            <TableCell>{toPrice(unitPrice / 1.19)}</TableCell>
                            <TableCell>{toPrice(unitPrice)}</TableCell>
                            <TableCell align="center">{p.quantitySold}</TableCell>
                            <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                {toPrice(lineSubtotal)}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
