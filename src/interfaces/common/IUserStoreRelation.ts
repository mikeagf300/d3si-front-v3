import type { IUser } from "@/interfaces/users/IUser"
import type { IStore } from "@/interfaces/stores/IStore"

export interface IUserStoreRelation {
    userStoreID: string
    user?: IUser | null
    store?: IStore | null
    role?: string
    createdAt: string
    updatedAt: string
}
