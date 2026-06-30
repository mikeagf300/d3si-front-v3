export const StoreUserRole = {
    Owner: "owner",
    StoreManager: "store_manager",
    Consignado: "consignado",
    Tercero: "tercero",
} as const

export type StoreUserRoleValue = (typeof StoreUserRole)[keyof typeof StoreUserRole]

export const STORE_USER_ROLE_OPTIONS: Array<{ value: StoreUserRoleValue; label: string; rank: number }> = [
    { value: StoreUserRole.Owner, label: "Admin / Propietario", rank: 1 },
    { value: StoreUserRole.StoreManager, label: "Store Manager", rank: 2 },
    { value: StoreUserRole.Consignado, label: "Consignado", rank: 3 },
    { value: StoreUserRole.Tercero, label: "Tercero", rank: 4 },
]

export function normalizeStoreUserRole(role?: string | null): StoreUserRoleValue | "" {
    if (role === "admin" || role === StoreUserRole.Owner) return StoreUserRole.Owner
    if (role === StoreUserRole.StoreManager) return StoreUserRole.StoreManager
    if (role === StoreUserRole.Consignado) return StoreUserRole.Consignado
    if (role === StoreUserRole.Tercero) return StoreUserRole.Tercero
    return ""
}

export function getStoreUserRoleLabel(role?: string | null) {
    const normalizedRole = normalizeStoreUserRole(role)
    return STORE_USER_ROLE_OPTIONS.find((option) => option.value === normalizedRole)?.label ?? "Sin rol"
}

export function getStoreUserRoleRank(role?: string | null) {
    const normalizedRole = normalizeStoreUserRole(role)
    return STORE_USER_ROLE_OPTIONS.find((option) => option.value === normalizedRole)?.rank ?? Number.MAX_SAFE_INTEGER
}
