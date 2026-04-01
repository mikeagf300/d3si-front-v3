import { ISaleProduct, IsaleProductReturned, ISaleResponse } from "@/interfaces/sales/ISale"

export const getAnulatedProducts = (sale: ISaleResponse): ISaleProduct[] => {
    // Backward compatible: match by `saleProductID` (new), `variationID` (new) or `storeProductID` (legacy)
    const returnedQtyByKey = new Map<string, number>()
    if (!sale.Return) return []
    const { SaleProducts, Return } = sale
    const { ProductAnulations } = Return
    ProductAnulations.forEach((anul: IsaleProductReturned) => {
        const returnedQty = anul.returnedQuantity || 0
        const keys = [anul.saleProductID, anul.variationID, anul.storeProductID].filter((k): k is string => Boolean(k))

        keys.forEach((key) => {
            returnedQtyByKey.set(key, (returnedQtyByKey.get(key) || 0) + returnedQty)
        })
    })

    const anulatedProducts: ISaleProduct[] = SaleProducts
        // ➡️ Filtrar: Solo mantiene los productos que tienen alguna devolución/anulación.
        .filter((saleP) => {
            const qty =
                (saleP.saleProductID && returnedQtyByKey.get(saleP.saleProductID)) ||
                (saleP.variationID && returnedQtyByKey.get(saleP.variationID)) ||
                0
            return qty > 0
        })

        // 🔄 Mapear: Transforma el objeto ISaleProduct.
        .map((saleP) => {
            const returnedQty =
                (saleP.saleProductID && returnedQtyByKey.get(saleP.saleProductID)) ||
                (saleP.variationID && returnedQtyByKey.get(saleP.variationID)) ||
                0

            // Crear una copia del producto vendido.
            const modifiedProduct: ISaleProduct = { ...saleP }

            // Sobreescribir los datos importantes.
            modifiedProduct.quantitySold = returnedQty
            return { ...modifiedProduct }
        })

    return anulatedProducts
}
