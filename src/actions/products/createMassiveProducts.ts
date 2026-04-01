"use server"

import { revalidatePath } from "next/cache"
import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"

interface MassiveCreateProductData {
    products: CreateProductFormData[]
}

export const createMassiveProducts = async (data: MassiveCreateProductData) => {
    try {
        for (const product of data.products) {
            const body = {
                name: product.name,
                image: product.image,
                categoryID: product.categoryID,
                brand: product.brand,
                genre: product.genre,
                variations: product.sizes.map((size) => ({
                    sku: size.sku,
                    priceCost: size.priceCost,
                    priceList: size.priceList,
                    stock: size.stockQuantity,
                    size: size.sizeNumber,
                })),
            }

            await fetcher(`${API_URL}/products`, {
                method: "POST",
                body: JSON.stringify(body),
            })
        }

        revalidatePath("/inventory")
        return { success: true }
    } catch (err) {
        console.error("Error al crear productos:", err)
        return {
            success: false,
            error: "No se pudieron crear los productos. Verifica los datos o intenta más tarde.",
        }
    }
}
