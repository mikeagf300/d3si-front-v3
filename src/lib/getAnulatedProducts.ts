import { ISaleProduct, ISaleResponse } from "@/interfaces/sales/ISale"

export const getAnulatedProducts = (sale: ISaleResponse): ISaleProduct[] => {
    const returnItems = sale.Return?.ProductAnulations ?? []
    if (returnItems.length === 0) return []

    const returnedQtyByKey = new Map<string, number>()

    for (const anul of returnItems) {
        const returnedQty = anul.returnedQuantity ?? 0
        const keys = [anul.saleProductID, anul.variationID, anul.storeProductID].filter(
            (key): key is string => Boolean(key),
        )

        for (const key of keys) {
            returnedQtyByKey.set(key, (returnedQtyByKey.get(key) ?? 0) + returnedQty)
        }
    }

    return sale.SaleProducts.flatMap((saleProduct) => {
        const returnedQty =
            returnedQtyByKey.get(saleProduct.saleProductID) ??
            returnedQtyByKey.get(saleProduct.variationID) ??
            0

        if (returnedQty <= 0) return []

        return [{ ...saleProduct, quantitySold: returnedQty }]
    })
}
