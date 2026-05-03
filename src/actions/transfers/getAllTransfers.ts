import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import {
    ITransfer,
    type ITransferListFilters,
    type ITransferListMeta,
    type ITransferListResult,
} from "@/interfaces/transfers/ITransfer"
import { normalizeTransfer, type RawTransfer } from "@/lib/normalize-transfer"
import { buildTransferListQuery } from "@/lib/transfers-query"

type RawTransferListResponse =
    | RawTransfer[]
    | {
          data?: RawTransfer[]
          items?: RawTransfer[]
          transfers?: RawTransfer[]
          meta?: Partial<ITransferListMeta>
          page?: number
          limit?: number
          total?: number
          totalPages?: number
      }

const DEFAULT_META: ITransferListMeta = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
}

/**
 * Obtiene las transferencias aplicando los filtros reales soportados por el back.
 * GET /transfers
 */
export async function getAllTransfers(filters: ITransferListFilters = {}): Promise<ITransferListResult> {
    const query = buildTransferListQuery(filters)
    const url = `${API_URL}/transfers${query ? `?${query}` : ""}`

    try {
        const raw = await fetcher<RawTransferListResponse>(url)

        const rawItems = Array.isArray(raw)
            ? raw
            : raw?.data ?? raw?.items ?? raw?.transfers ?? []

        const items = Array.isArray(rawItems) ? rawItems.map(normalizeTransfer) : []
        const meta = Array.isArray(raw)
            ? {
                  ...DEFAULT_META,
                  page: filters.page ?? DEFAULT_META.page,
                  limit: filters.limit ?? DEFAULT_META.limit,
                  total: items.length,
                  totalPages: items.length > 0 ? 1 : 0,
              }
            : {
                  ...DEFAULT_META,
                  page: raw?.meta?.page ?? raw?.page ?? filters.page ?? DEFAULT_META.page,
                  limit: raw?.meta?.limit ?? raw?.limit ?? filters.limit ?? DEFAULT_META.limit,
                  total: raw?.meta?.total ?? raw?.total ?? items.length,
                  totalPages:
                      raw?.meta?.totalPages ??
                      raw?.totalPages ??
                      Math.ceil((raw?.meta?.total ?? raw?.total ?? items.length) / (raw?.meta?.limit ?? raw?.limit ?? filters.limit ?? DEFAULT_META.limit)),
              }

        return { items, meta }
    } catch (error) {
        console.log(error)
        return { items: [], meta: { ...DEFAULT_META, page: filters.page ?? 1, limit: filters.limit ?? 20, totalPages: 0 } }
    }
}
