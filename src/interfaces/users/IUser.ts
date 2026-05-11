import type { IStore } from "../stores/IStore"
import { UserRole } from "@/lib/userRoles"
import type { IUserStoreRelation } from "@/interfaces/common/IUserStoreRelation"

export interface IUser {
    userID: string
    name: string
    email: string
    role: UserRole
    password: string
    userImg: string | null
    createdAt: string
    updatedAt: string
    userStores: IUserStoreRelation[]
    Stores?: IStore[]
}
