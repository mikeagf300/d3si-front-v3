import { redirect } from "next/navigation"
import { checkStatus } from "@/actions/auth/authActions"
import { getUserStores } from "@/actions/users/getUserStores"
import HomeDashboard from "../../components/Home/HomeDashboard"
import { buildHomeViewModel } from "../../components/Home/home-view-model"

interface SearchParams {
    searchParams: Promise<{
        storeID: string
        date: string
    }>
}

export default async function HomePage({ searchParams }: SearchParams) {
    const { storeID = "", date = "" } = await searchParams
    let effectiveStoreID = storeID
    if (!effectiveStoreID) {
        const auth = await checkStatus().catch(() => null)
        const userStores = auth?.user?.userID ? await getUserStores(auth.user.userID) : []
        effectiveStoreID = userStores[0]?.storeID ?? ""
    }

    const viewModel = await buildHomeViewModel(effectiveStoreID, date)

    if (!viewModel) {
        redirect("/login")
    }

    return (
        <HomeDashboard
            stores={viewModel.stores}
            resume={viewModel.resume}
            allSalesForResume={viewModel.allSalesForResume}
            items={viewModel.items}
            allProducts={viewModel.allProducts}
            dateRef={viewModel.dateRef}
            date={viewModel.date}
        />
    )
}
