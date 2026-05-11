import ProductVerificationPage from "@/components/Invoices/ProductVerificationPage"
import { getPurchaseOrderById } from "@/actions/purchase-orders/getPurchaseOrderById"
import { getAllProducts } from "@/actions/products/getAllProducts"

export default async function VerifyOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [order, allProducts] = await Promise.all([getPurchaseOrderById(id), getAllProducts()])

    return <ProductVerificationPage order={order} allProducts={allProducts} />
}
