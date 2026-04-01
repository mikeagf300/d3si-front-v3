import { ISaleProduct, IsaleProductReturned, ISaleResponse } from "@/interfaces/sales/ISale"

export const getAnulatedProducts = (sale: ISaleResponse): ISaleProduct[] => {
    //    Usamos el saleProductID como clave.
    const anulationMap = new Map<string, IsaleProductReturned>()
    if (!sale.Return) return []
    const { SaleProducts, Return } = sale
    const { ProductAnulations } = Return
    ProductAnulations.forEach((anul) => {
        anulationMap.set(anul.storeProductID, anul)
    })

    const anulatedProducts: ISaleProduct[] = SaleProducts
        // ➡️ Filtrar: Solo mantiene los productos que tienen un registro en el mapa de anulaciones.
        .filter((saleP) => anulationMap.has(saleP.saleProductID))

        // 🔄 Mapear: Transforma el objeto ISaleProduct.
        .map((saleP) => {
            const anulationData = anulationMap.get(saleP.saleProductID)! // Es seguro por el filtro

            // Crear una copia del producto vendido.
            const modifiedProduct: ISaleProduct = { ...saleP }

            // Sobreescribir los datos importantes.
            modifiedProduct.quantitySold = anulationData.returnedQuantity
            return { ...modifiedProduct }
        })

    return anulatedProducts
}
