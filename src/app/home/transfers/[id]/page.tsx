import { getTransferById } from "@/actions/transfers/getTransferById"
import { getAllProducts } from "@/actions/products/getAllProducts"
import TransferDetailWrapper from "@/components/Transfers/TransferDetailWrapper"
import { redirect } from "next/navigation"

interface TransferDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function TransferDetailPage({ params }: TransferDetailPageProps) {
    const { id } = await params
    if (!id || id === "undefined" || id === "null") {
        redirect("/home/transfers")
    }
    const [transfer, products] = await Promise.all([getTransferById(id), getAllProducts()])

    return (
        <main className="p-6 flex-1 flex flex-col overflow-hidden">
            <TransferDetailWrapper initialTransfer={transfer} products={products} />
        </main>
    )
}
