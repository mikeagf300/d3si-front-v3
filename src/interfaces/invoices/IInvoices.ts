import { IStore } from "../stores/IStore"
import { IPurchaseOrder } from "../orders/IPurchaseOrder"

export interface InvoicesClientProps {
    initialOrders: IPurchaseOrder[]
    stores: IStore[]
}
