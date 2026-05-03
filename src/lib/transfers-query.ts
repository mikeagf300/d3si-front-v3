import type { ITransferListFilters, TransferStatus } from "@/interfaces/transfers/ITransfer"

export const TRANSFER_STATUS_OPTIONS: TransferStatus[] = ["PENDING", "COMPLETED", "CANCELLED"]

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const normalizeSearchValue = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) return normalizeSearchValue(value[0])
    const trimmed = value?.trim()
    return trimmed ? trimmed : undefined
}

const normalizePositiveNumber = (value: string | string[] | undefined, fallback: number): number => {
    const parsed = Number(normalizeSearchValue(value))
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback
}

export const parseTransferListFilters = (
    searchParams: Record<string, string | string[] | undefined> | undefined,
): ITransferListFilters => {
    const originStoreID = normalizeSearchValue(searchParams?.originStoreID)
    const destinationStoreID = normalizeSearchValue(searchParams?.destinationStoreID)
    const status = normalizeSearchValue(searchParams?.status)
    const page = normalizePositiveNumber(searchParams?.page, DEFAULT_PAGE)
    const limit = normalizePositiveNumber(searchParams?.limit, DEFAULT_LIMIT)

    return {
        originStoreID,
        destinationStoreID,
        status: TRANSFER_STATUS_OPTIONS.includes(status as TransferStatus) ? (status as TransferStatus) : undefined,
        page,
        limit,
    }
}

export const buildTransferListQuery = (filters: ITransferListFilters): string => {
    const params = new URLSearchParams()

    if (filters.originStoreID) params.set("originStoreID", filters.originStoreID)
    if (filters.destinationStoreID) params.set("destinationStoreID", filters.destinationStoreID)
    if (filters.status) params.set("status", filters.status)
    if (filters.page && filters.page > DEFAULT_PAGE) params.set("page", String(filters.page))
    if (filters.limit && filters.limit !== DEFAULT_LIMIT) params.set("limit", String(filters.limit))

    return params.toString()
}

export const transferListDefaults = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
}
