import { getAllProducts } from "@/actions/products/getAllProducts"
import { getOffers } from "@/actions/pricing/getOffers"
import { DiscountManagementPanel } from "@/components/Discounts/DiscountManagementPanel"

const InventoryDiscountsPage = async () => {
    const [products, offers] = await Promise.all([getAllProducts(), getOffers()])

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6">
            <div className="mx-auto max-w-6xl px-4">
                <DiscountManagementPanel products={products} offers={offers} />
            </div>
        </main>
    )
}

export default InventoryDiscountsPage
