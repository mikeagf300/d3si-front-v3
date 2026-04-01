import { IStore } from "../stores/IStore"
import { IUser } from "../users/IUser"

// Para enviar una nueva venta desde el frontend
export type PaymentType = "Efectivo" | "Debito" | "Credito"
export type PaymentStatus = "Pagado" | "Pendiente" | "Anulado"

export interface ISaleItemRequest {
    variationID: string
    quantity: number
    unitPrice: number
}

export interface ISaleRequest {
    storeID: string
    paymentType: PaymentType
    items: ISaleItemRequest[]
}

export interface IUpdateSaleStatus {
    status: PaymentStatus
}

// Para representar un producto vendido
export interface IProductSold {
    storeProductID: string
    quantitySold: number
}

// Variación de producto dentro de una venta (tal como la devuelve el API)
export interface IVariationInSale {
    variationID: string
    productID: string
    sku: string
    color: string
    size: string
    createdAt: string
    updatedAt: string
}

export interface ISaleProduct {
    saleProductID: string
    saleID: string
    variationID: string
    variation: IVariationInSale
    unitPrice: number | string
    subtotal: number | string
    quantitySold: number
    createdAt: string
    updatedAt: string
}

// Para representar una venta que viene desde el backend (respuesta)
export interface ISaleResponse {
    saleID: string
    storeID: string
    total: number
    status: PaymentStatus
    createdAt: string
    paymentType?: string
    Store: IStore
    SaleProducts: ISaleProduct[]
    Return: ISaleReturn | null
}

export interface IsaleProductReturned {
    returnItemID: string
    returnID: string
    storeProductID: string
    returnedQuantity: number
    unitPrice: string
    createdAt: string
    updatedAt: string
}

export interface ISaleReturn {
    returnID: string
    saleID: string
    clientEmail: string
    reason: string
    type: "DEVOLUCION" | "GARANTIA"
    processedBy: string
    additionalNotes: string
    createdAt: string
    updatedAt: string
    User: IUser
    ProductAnulations: IsaleProductReturned[]
}

export type ISendSaleReturn = Omit<ISaleReturn, "returnID" | "createdAt" | "updatedAt" | "User" | "saleID"> & {
    returnedProducts?: {
        storeProductID: string
        quantity: number
    }[]
}
