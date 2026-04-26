import { getAllTransfers } from "@/actions/transfers/getAllTransfers"
import { getAllStores } from "@/actions/stores/getAllStores"
import TransfersClientWrapper from "@/components/Transfers/TransfersClientWrapper"

export default async function TransfersPage({
    searchParams,
}: {
    searchParams: Promise<{
        originStoreID?: string
        destinationStoreID?: string
        status?: string
        startDate?: string
        endDate?: string
    }>
}) {
    const filters = await searchParams
    const [transfers, stores] = await Promise.all([getAllTransfers(filters).catch(() => []), getAllStores()])

    return (
        <main className="p-6 flex-1 flex flex-col h-screen overflow-hidden">
            <TransfersClientWrapper initialTransfers={transfers} stores={stores} />
        </main>
    )
}
