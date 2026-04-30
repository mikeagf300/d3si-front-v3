import { getTransferById } from "@/actions/transfers/getTransferById"
import { getAllProducts } from "@/actions/products/getAllProducts"
import TransferDetailWrapper from "@/components/Transfers/TransferDetailWrapper"
import { redirect } from "next/navigation"

export default async function TransferDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    if (!id || id === "undefined" || id === "null") {
        redirect("/home/transfers")
    }
    const [transfer, products] = await Promise.all([getTransferById(id), getAllProducts()])

    return (
        <main className="p-6 flex-1 flex flex-col h-screen overflow-hidden">
            <TransferDetailWrapper initialTransfer={transfer} products={products} />
        </main>
    )
}
