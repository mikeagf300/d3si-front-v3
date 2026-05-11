"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { QuoteDocument } from "@/components/Quotes/pdf/QuoteDocument"
import { pdf } from "@react-pdf/renderer"
import { getProductById } from "@/actions/products/getProductById"
import { ClientDataForm } from "@/components/Quotes//ClientDataForm/ClientDataForm"
import { ExpirationConfig } from "@/components/Quotes/ExpirationConfig/ExpirationConfig"
import { ProductImages } from "@/components/Quotes/Products/ProductImages"
import { ProductSelector } from "@/components/Quotes/Products/ProductSelector"
import { ProductTable } from "@/components/Quotes/Products/ProductTable"
import { DiscountsSection } from "@/components/Quotes/DiscountsSection/DiscountsSection"
import { FinancialSummary } from "@/components/Quotes/FinancialSummary/FinancialSummary"

interface QuotesClientProps {
    products: IProduct[]
}

// Tipo para descuentos/cargos procesados
interface ProcessedDiscount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    typeAndDescription: string
    percentage: number
    amount: number
}

// Tipo extendido para productos seleccionados
interface SelectedProduct {
    product: IProduct
    variation?: IProductVariation
    quantity: number
    availableModels: string
    unitPrice: number
    isCustomProduct?: boolean
}

export function QuotesClient({ products }: QuotesClientProps) {
    const [discounts, setDiscounts] = useState<
        { id: number; type: "Descuento" | "Cargo"; description: string; percentage: number }[]
    >([])
    const [productsImage, setProductsImage] = useState<{ id: string; image: string }[]>([])
    const [vencimientoCantidad, setVencimientoCantidad] = useState("30")
    const [vencimientoPeriodo, setVencimientoPeriodo] = useState<"dias" | "semanas" | "meses">("dias")
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
    const [observaciones, setObservaciones] = useState("")
    const [nroCotizacion, setNroCotizacion] = useState(5100)
    const [customProducts, setCustomProducts] = useState<IProduct[]>([])
    const [clientData, setClientData] = useState({
        rut: "",
        razonSocial: "",
        giro: "",
        comuna: "",
        email: "",
        telefono: "",
    })

    useEffect(() => {
        const stored = localStorage.getItem("nroCotizacion")
        if (stored) {
            setNroCotizacion(Number(stored))
        }
    }, [])

    const allProducts = useMemo(() => {
        return [...products, ...customProducts]
    }, [products, customProducts])

    const filteredProducts = useMemo(() => {
        const selectedProductIds = new Set(selectedProducts.map((sp) => sp.product.productID))
        return allProducts.filter((product) => !selectedProductIds.has(product.productID))
    }, [allProducts, selectedProducts])

    const uniqueSelectedProducts = useMemo(() => {
        const productCounts = new Map<string, { product: IProduct; count: number }>()

        selectedProducts.forEach((sp) => {
            const productId = sp.product.productID
            if (productCounts.has(productId)) {
                productCounts.get(productId)!.count += sp.quantity
            } else {
                productCounts.set(productId, { product: sp.product, count: sp.quantity })
            }
        })

        return Array.from(productCounts.values())
    }, [selectedProducts])

    useEffect(() => {
        setProductsImage((prev) => {
            return uniqueSelectedProducts.map((productData) => {
                const existing = prev.find((p) => p.id === productData.product.productID)
                if (existing) return existing

                if (productData.product.image) {
                    return {
                        id: productData.product.productID,
                        image: productData.product.image,
                    }
                }

                return {
                    id: productData.product.productID,
                    image: "",
                }
            })
        })
    }, [uniqueSelectedProducts])

    const handleImageUpload = (productId: string, file: File) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Image = reader.result as string
            setProductsImage((prev) => prev.map((p) => (p.id === productId ? { ...p, image: base64Image } : p)))
        }

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleProductSelect = (productId: string) => {
        const product = allProducts.find((item) => item.productID === productId)
        if (!product) return

        const variations = product.ProductVariations || []
        const validVariations = variations.filter((variation) => variation.sizeNumber?.trim())
        const models = Array.from(new Set(validVariations.map((variation) => variation.sizeNumber.trim())))
        const priceSource = validVariations.length > 0 ? validVariations : variations
        const totalPrice = priceSource.reduce((sum, variation) => sum + Number(variation.priceList || 0), 0)
        const avgPrice = priceSource.length > 0 ? totalPrice / priceSource.length : 0

        const newSelectedProduct: SelectedProduct = {
            product,
            quantity: 1,
            availableModels: models.join(", "),
            unitPrice: Math.round(avgPrice),
            isCustomProduct: customProducts.some((cp) => cp.productID === productId),
        }

        setSelectedProducts((prev) => [...prev, newSelectedProduct])
    }

    const handleAddNewProduct = (productData: { name: string; image?: string }) => {
        const newProductId = `custom_${Date.now()}`
        const newProduct: IProduct = {
            productID: newProductId,
            name: productData.name,
            image: productData.image || "",
            ProductVariations: [],
            totalProducts: 0,
            categoryID: "",
            genre: "Unisex",
            brand: "Otro",
            stock: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Category: undefined,
            description: "",
            wooID: null,
        }

        setCustomProducts((prev) => [...prev, newProduct])

        if (productData.image) {
            setProductsImage((prev) => [...prev, { id: newProductId, image: productData.image || "" }])
        }

        const newSelectedProduct: SelectedProduct = {
            product: newProduct,
            quantity: 1,
            availableModels: "",
            unitPrice: 0,
            isCustomProduct: true,
        }

        setSelectedProducts((prev) => [...prev, newSelectedProduct])
    }

    const handleQuantityChange = (productId: string, quantity: number) => {
        setSelectedProducts((prev) => prev.map((sp) => (sp.product.productID === productId ? { ...sp, quantity } : sp)))
    }

    const handleModelsChange = (productId: string, models: string) => {
        setSelectedProducts((prev) =>
            prev.map((sp) => (sp.product.productID === productId ? { ...sp, availableModels: models } : sp)),
        )
    }

    const handleUnitPriceChange = (productId: string, price: number) => {
        setSelectedProducts((prev) =>
            prev.map((sp) => (sp.product.productID === productId ? { ...sp, unitPrice: price } : sp)),
        )
    }

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts((prev) => prev.filter((sp) => sp.product.productID !== productId))

        const isCustomProduct = customProducts.some((cp) => cp.productID === productId)
        if (isCustomProduct) {
            setCustomProducts((prev) => prev.filter((cp) => cp.productID !== productId))
            setProductsImage((prev) => prev.filter((pi) => pi.id !== productId))
        }
    }

    const periodoLabel = {
        dias: Number(vencimientoCantidad) === 1 ? "día" : "días",
        semanas: Number(vencimientoCantidad) === 1 ? "semana" : "semanas",
        meses: Number(vencimientoCantidad) === 1 ? "mes" : "meses",
    }

    const montoNeto = selectedProducts.reduce((acc, sp) => acc + sp.quantity * sp.unitPrice, 0)

    const totalDescuentos = discounts
        .filter((discount) => discount.type === "Descuento")
        .reduce((acc, discount) => acc + montoNeto * (discount.percentage / 100), 0)

    const totalCargos = discounts
        .filter((discount) => discount.type === "Cargo")
        .reduce((acc, discount) => acc + discount.percentage, 0)

    const subtotal = montoNeto - totalDescuentos + totalCargos
    const iva = subtotal * 0.19
    const montoTotal = subtotal + iva

    const processedDiscounts: ProcessedDiscount[] = useMemo(() => {
        return discounts.map((discount) => {
            let calculatedPercentage: number
            let calculatedAmount: number

            if (discount.type === "Descuento") {
                calculatedPercentage = discount.percentage
                calculatedAmount = montoNeto * (discount.percentage / 100)
            } else {
                calculatedAmount = discount.percentage
                calculatedPercentage = montoNeto > 0 ? (discount.percentage / montoNeto) * 100 : 0
            }

            return {
                id: discount.id,
                type: discount.type,
                description: discount.description,
                typeAndDescription: `[${discount.type.toUpperCase()}] ${discount.description}`,
                percentage: Math.round(calculatedPercentage * 100) / 100,
                amount: calculatedAmount,
            }
        })
    }, [discounts, montoNeto])

    const handleGeneratePDF = async () => {
        const pdfSelectedProducts = await Promise.all(
            selectedProducts.map(async (sp) => {
                if (sp.variation) {
                    return { product: sp.product, variation: sp.variation, quantity: sp.quantity }
                }

                try {
                    const prod = await getProductById(sp.product.productID)
                    const variations = prod.ProductVariations || []
                    const wantedSizes = sp.availableModels
                        .split(",")
                        .map((size) => size.trim())
                        .filter(Boolean)

                    let foundVar: IProductVariation | undefined

                    if (wantedSizes.length > 0) {
                        foundVar = variations.find((variation) => wantedSizes.includes(variation.sizeNumber))
                    }

                    if (!foundVar) {
                        foundVar = variations.find((variation) => Number(variation.priceList) > 0) || variations[0]
                    }

                    if (foundVar) {
                        return { product: prod, variation: foundVar, quantity: sp.quantity }
                    }
                } catch (error) {
                    console.warn("QuotesClient: error fetching product for PDF", error)
                }

                const fallback: IProductVariation = {
                    variationID: `${sp.product.productID}_fallback`,
                    productID: sp.product.productID,
                    sizeNumber: sp.availableModels || "",
                    priceList: sp.unitPrice || 0,
                    priceCost: sp.unitPrice || 0,
                    sku: "",
                    stockQuantity: 0,
                    StoreProducts: [],
                    Stores: [],
                    createdAt: "",
                    updatedAt: "",
                }

                return { product: sp.product, variation: fallback, quantity: sp.quantity }
            }),
        )

        const blob = await pdf(
            <QuoteDocument
                selectedProducts={pdfSelectedProducts}
                productsImages={productsImage}
                processedDiscounts={processedDiscounts}
                vencimientoCantidad={vencimientoCantidad}
                vencimientoPeriodo={vencimientoPeriodo}
                montoNeto={montoNeto}
                totalDescuentos={totalDescuentos}
                totalCargos={totalCargos}
                subtotal={subtotal}
                iva={iva}
                montoTotal={montoTotal}
                nroCotizacion={nroCotizacion}
                clientData={{
                    rut: clientData.rut,
                    razonsocial: clientData.razonSocial,
                    giro: clientData.giro,
                    comuna: clientData.comuna,
                    email: clientData.email,
                    telefono: clientData.telefono,
                }}
                observaciones={observaciones}
            />,
        ).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Cotizacion_${nroCotizacion}.pdf`
        link.click()
        URL.revokeObjectURL(url)

        const nextNro = nroCotizacion + 1
        setNroCotizacion(nextNro)
        localStorage.setItem("nroCotizacion", nextNro.toString())
    }

    return (
        <>
            <ExpirationConfig
                vencimientoCantidad={vencimientoCantidad}
                vencimientoPeriodo={vencimientoPeriodo}
                periodoLabel={periodoLabel}
                nroCotizacion={nroCotizacion}
                onCantidadChange={setVencimientoCantidad}
                onPeriodoChange={setVencimientoPeriodo}
            />

            <ClientDataForm clientData={clientData} onClientDataChange={setClientData} />

            <ProductImages
                uniqueSelectedProducts={uniqueSelectedProducts}
                productsImage={productsImage}
                onImageUpload={handleImageUpload}
            />

            <ProductSelector
                filteredProducts={filteredProducts}
                onProductSelect={handleProductSelect}
                onAddNewProduct={handleAddNewProduct}
            />

            {selectedProducts.length > 0 && (
                <ProductTable
                    selectedProducts={selectedProducts}
                    onQuantityChange={handleQuantityChange}
                    onModelsChange={handleModelsChange}
                    onUnitPriceChange={handleUnitPriceChange}
                    onRemoveProduct={handleRemoveProduct}
                />
            )}

            <DiscountsSection discounts={discounts} montoNeto={montoNeto} onDiscountsChange={setDiscounts} />

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Otras Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Observaciones adicionales sobre la cotización..."
                        value={observaciones}
                        onChange={(event) => setObservaciones(event.target.value)}
                        className="min-h-[100px] bg-white dark:bg-slate-700"
                    />
                </CardContent>
            </Card>

            <FinancialSummary
                montoNeto={montoNeto}
                totalDescuentos={totalDescuentos}
                totalCargos={totalCargos}
                subtotal={subtotal}
                iva={iva}
                montoTotal={montoTotal}
            />

            <div className="text-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGeneratePDF}>
                    Generar Cotización
                </Button>
            </div>
        </>
    )
}
