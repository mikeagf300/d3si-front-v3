export const Role = {
    Admin: "admin",
    Consignado: "consignado",
    Vendedor: "store_manager",
    Tercero: "tercero",
}

export type UserRole = "admin" | "owner" | "consignado" | "store_manager" | "tercero"
export type ApiRole = "ROLE_ADMIN" | "ROLE_USER" | string

export const isSuperAdmin = (user?: { role?: string | null; roles?: ApiRole | null } | null) =>
    user?.role === Role.Admin || user?.roles === "ROLE_ADMIN"
