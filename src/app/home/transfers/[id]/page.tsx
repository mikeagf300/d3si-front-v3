import { getTransferById } from "@/actions/transfers/getTransferById"
import { getAllProducts } from "@/actions/products/getAllProducts"
import TransferDetailWrapper from "@/components/Transfers/TransferDetailWrapper"

export default async function TransferDetailPage({ params }: { params: { id: string } }) {
    const { id } = params

    // El id viene del servidor
    const [transfer, products] = await Promise.all([getTransferById(id), getAllProducts()])

    return (
        <main className="p-6 flex-1 flex flex-col h-screen overflow-hidden">
            <TransferDetailWrapper initialTransfer={transfer} products={products} />
        </main>
    )
}
