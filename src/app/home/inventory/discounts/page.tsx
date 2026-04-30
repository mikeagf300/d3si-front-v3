import { getAllProducts } from "@/actions/products/getAllProducts"
import { DiscountManagementPanel } from "@/components/Discounts/DiscountManagementPanel"

const InventoryDiscountsPage = async () => {
    const products = await getAllProducts()

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6">
            <div className="mx-auto max-w-6xl px-4">
                <DiscountManagementPanel products={products} />
            </div>
        </main>
    )
}

export default InventoryDiscountsPage
