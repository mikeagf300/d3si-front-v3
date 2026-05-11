import type { IUser } from "../users/IUser"
import { IStoreProduct } from "./IStoreProduct"
import type { IUserStoreRelation } from "@/interfaces/common/IUserStoreRelation"

export interface IStore {
    storeID: string
    name: string
    storeImg: string | null
    location: string
    rut: string
    phone: string
    address: string
    city: string
    email: string
    type?: string
    isCentralStore?: boolean
    /** @deprecated use isCentralStore */
    isAdminStore?: boolean
    markup?: string
    role?: string
    createdAt: string
    updatedAt: string
    StoreProduct?: IStoreProduct
    userStores: IUserStoreRelation[]
    Users?: IUser[]
}
