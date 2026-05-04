import type { IStore } from "@/interfaces/stores/IStore"
import type { IUser } from "@/interfaces/users/IUser"
import type { IUserStoreRelation } from "@/interfaces/common/IUserStoreRelation"
import { pickArray, pickFirst } from "./normalize-helpers"

type RawRelation = {
    userStoreID?: string
    createdAt?: string
    updatedAt?: string
    user?: IUser | null
    store?: IStore | null
    User?: IUser | null
    Store?: IStore | null
}

type RawUser = {
    userID?: string
    id?: string
    name?: string
    email?: string
    role?: IUser["role"]
    password?: string
    userImg?: string | null
    createdAt?: string
    updatedAt?: string
    userStores?: RawRelation[]
    Stores?: IStore[]
}

type RawStore = {
    storeID?: string
    name?: string
    storeImg?: string | null
    location?: string
    rut?: string
    phone?: string
    address?: string
    city?: string
    email?: string
    type?: IStore["type"]
    isCentralStore?: boolean
    isAdminStore?: boolean
    markup?: string
    role?: string
    createdAt?: string
    updatedAt?: string
    StoreProduct?: IStore["StoreProduct"]
    userStores?: RawRelation[]
    Users?: IUser[]
}

const normalizeRelation = (relation: RawRelation): IUserStoreRelation => ({
    userStoreID: relation.userStoreID ?? "",
    createdAt: relation.createdAt ?? "",
    updatedAt: relation.updatedAt ?? "",
    user: pickFirst(relation.user, relation.User) ?? null,
    store: pickFirst(relation.store, relation.Store) ?? null,
})

export const normalizeUser = (raw: RawUser): IUser => {
    const userStores = pickArray(raw.userStores).map(normalizeRelation)
    const stores = pickFirst(raw.Stores, userStores.map((relation) => relation.store).filter((store): store is IStore => Boolean(store))) ?? []

    return {
        userID: raw.userID ?? raw.id ?? "",
        name: raw.name ?? "",
        email: raw.email ?? "",
        role: raw.role ?? "admin",
        password: raw.password ?? "",
        userImg: raw.userImg ?? null,
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        userStores,
        Stores: stores,
    }
}

export const normalizeStore = (raw: RawStore): IStore => {
    const userStores = pickArray(raw.userStores).map(normalizeRelation)
    const users = pickFirst(raw.Users, userStores.map((relation) => relation.user).filter((user): user is IUser => Boolean(user))) ?? []

    return {
        storeID: raw.storeID ?? "",
        name: raw.name ?? "",
        storeImg: raw.storeImg ?? null,
        location: raw.location ?? "",
        rut: raw.rut ?? "",
        phone: raw.phone ?? "",
        address: raw.address ?? "",
        city: raw.city ?? "",
        email: raw.email ?? "",
        type: raw.type,
        isCentralStore: raw.isCentralStore,
        isAdminStore: raw.isAdminStore,
        markup: raw.markup,
        role: raw.role,
        createdAt: raw.createdAt ?? "",
        updatedAt: raw.updatedAt ?? "",
        StoreProduct: raw.StoreProduct,
        userStores,
        Users: users,
    }
}
