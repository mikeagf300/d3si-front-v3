import { getAllTransfers } from "@/actions/transfers/getAllTransfers"
import { getAllStores } from "@/actions/stores/getAllStores"
import TransfersClientWrapper from "@/components/Transfers/TransfersClientWrapper"
import { parseTransferListFilters, transferListDefaults } from "@/lib/transfers-query"

interface TransfersPageProps {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function TransfersPage({ searchParams }: TransfersPageProps) {
    const resolvedSearchParams = await searchParams
    const filters = parseTransferListFilters(resolvedSearchParams)

    const [transferResult, stores] = await Promise.all([getAllTransfers(filters), getAllStores()])

    const filterKey = [
        filters.originStoreID ?? "",
        filters.destinationStoreID ?? "",
        filters.status ?? "",
        filters.page ?? transferListDefaults.page,
        filters.limit ?? transferListDefaults.limit,
    ].join("|")

    return (
        <main className="p-6 flex-1 flex flex-col h-screen overflow-hidden">
            <TransfersClientWrapper
                key={filterKey}
                initialTransfers={transferResult.items}
                paginationMeta={transferResult.meta}
                stores={stores}
                initialFilters={filters}
            />
        </main>
    )
}
