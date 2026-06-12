import { redirect } from "next/navigation"
import { checkStatus } from "@/actions/auth/authActions"
import { getUserStores } from "@/actions/users/getUserStores"
import { getAllStores } from "@/actions/stores/getAllStores"
import HomeDashboard from "../../components/Home/HomeDashboard"
import { buildHomeViewModel } from "../../components/Home/home-view-model"
import { isSuperAdmin } from "@/lib/userRoles"

interface SearchParams {
    searchParams: Promise<{
        storeID: string
        date: string
    }>
}

export default async function HomePage({ searchParams }: SearchParams) {
    const { storeID = "", date = "" } = await searchParams
    let effectiveStoreID = storeID
    let hasAuthSession = true
    if (!effectiveStoreID) {
        const auth = await checkStatus().catch(() => null)
        hasAuthSession = Boolean(auth?.user?.userID)
        const userStores = auth?.user?.userID
            ? isSuperAdmin(auth.user)
                ? await getAllStores()
                : await getUserStores(auth.user.userID)
            : []
        effectiveStoreID = userStores[0]?.storeID ?? ""
    }

    if (!storeID && effectiveStoreID) {
        const params = new URLSearchParams()
        params.set("storeID", effectiveStoreID)
        if (date) params.set("date", date)
        redirect(`/home?${params.toString()}`)
    }

    if (!effectiveStoreID) {
        if (!hasAuthSession) {
            redirect("/login")
        }

        return (
            <div className="px-8 py-10">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No hay tienda activa</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    La sesi&oacute;n est&aacute; activa, pero no se encontr&oacute; ninguna tienda disponible para este usuario.
                </p>
            </div>
        )
    }

    const viewModel = await buildHomeViewModel(effectiveStoreID, date)

    if (!viewModel) {
        return (
            <div className="px-8 py-10">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No se pudo cargar el panel</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    La sesi&oacute;n sigue activa, pero no se pudo construir el contexto de la tienda seleccionada.
                </p>
            </div>
        )
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
