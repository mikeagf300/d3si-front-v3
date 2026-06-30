export const StoreType = {
    Central: "central",
    Franchise: "franchise",
    Consignment: "consignment",
    ThirdParty: "third_party",
} as const

export type StoreTypeValue = (typeof StoreType)[keyof typeof StoreType]

export const STORE_TYPE_OPTIONS: Array<{ value: StoreTypeValue; label: string }> = [
    { value: StoreType.Central, label: "Central" },
    { value: StoreType.Franchise, label: "Franquicia" },
    { value: StoreType.Consignment, label: "Consignada" },
    { value: StoreType.ThirdParty, label: "Tercero" },
]

export function getValidStoreType(type?: string | null) {
    if (!type) return ""
    return STORE_TYPE_OPTIONS.some((option) => option.value === type) ? type : ""
}

export function getStoreTypeLabel(type: string) {
    return STORE_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? "Selecciona tipo"
}
