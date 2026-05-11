import { ISaleProduct } from "@/interfaces/sales/ISale"
import { WooProductOrder } from "@/interfaces/woocommerce/Order"

// map (products: ISaleProduct[]): WooProductOrder[]) ..
export const mapLineItemsToSaleProducts = (lineItems: WooProductOrder[]): ISaleProduct[] => {
    return lineItems.map((item) => ({
        saleProductID: String(item.id),
        saleID: "",
        variationID: String(item.id),
        variation: {
            variationID: String(item.id),
            productID: String(item.product_id),
            sku: item.name,
            color: "",
            size: "",
            createdAt: "",
            updatedAt: "",
        },
        quantitySold: item.quantity,
        unitPrice: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        createdAt: "",
        updatedAt: "",
    }))
}
