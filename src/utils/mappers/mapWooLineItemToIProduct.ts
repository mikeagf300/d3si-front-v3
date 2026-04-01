// src/mappers/mapWooLineItemToIProduct.ts
import { ISaleProduct } from "@/interfaces/sales/ISale"
import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"

export const mapWooLineItemToISaleProduct = (
    lineItem: WooCommerceOrder["line_items"][0],
    orderDate: string,
): ISaleProduct => {
    const variationID = lineItem.variation_id ? String(lineItem.variation_id) : `${lineItem.product_id}-default`

    return {
        saleProductID: String(lineItem.id),
        saleID: "",
        variationID,
        variation: {
            variationID,
            productID: String(lineItem.product_id),
            sku: lineItem.sku || lineItem.name,
            color: "",
            size: "",
            createdAt: orderDate,
            updatedAt: orderDate,
        },
        quantitySold: lineItem.quantity,
        unitPrice: Number(lineItem.price),
        subtotal: Number(lineItem.price) * lineItem.quantity,
        createdAt: orderDate,
        updatedAt: orderDate,
    }
}
