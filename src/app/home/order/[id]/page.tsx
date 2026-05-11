import OrderDetail from "@/components/Invoices/OrderDetail"
import { getPurchaseOrderById } from "@/actions/purchase-orders/getPurchaseOrderById"
import { getAllProducts } from "@/actions/products/getAllProducts"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getPurchaseOrderById(id)
    const allProducts = await getAllProducts()
    return <OrderDetail order={order} allProducts={allProducts} />
}
