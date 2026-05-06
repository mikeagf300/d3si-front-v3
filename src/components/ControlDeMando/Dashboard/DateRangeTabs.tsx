"use client"

import React from "react"

interface DateRangeTabsProps {
    dateRange: { start: string; end: string }
    setDateRange: (range: { start: string; end: string }) => void
    activeTab: string
    setActiveTab: (tab: string) => void
}

/** DD-MM-YYYY → YYYY-MM-DD para el input[type=date] */
function toInputDate(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split("-")
    if (parts.length !== 3) return ""
    const [d, m, y] = parts
    return `${y}-${m}-${d}`
}

/** YYYY-MM-DD (input[type=date]) → DD-MM-YYYY (estado interno) */
function fromInputDate(yyyymmdd: string): string {
    const parts = yyyymmdd.split("-")
    if (parts.length !== 3) return ""
    const [y, m, d] = parts
    return `${d}-${m}-${y}`
}

export default function DateRangeTabs({ dateRange, setDateRange, activeTab, setActiveTab }: DateRangeTabsProps) {
    const tabs = [
        { id: "detallado", label: "Ventas Detallado" },
        { id: "comparadas", label: "Ventas Comparadas" },
        { id: "markup", label: "Mark Up" },
    ]

    return (
        <div className="mb-4 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-4">
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 lg:flex-row flex-col">
                        <input
                            title="Fecha inicio"
                            type="date"
                            value={toInputDate(dateRange.start)}
                            onChange={(e) =>
                                e.target.value && setDateRange({ ...dateRange, start: fromInputDate(e.target.value) })
                            }
                            className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-40 w-full md:w-auto"
                        />
                        <input
                            type="date"
                            title="Fecha fin"
                            value={toInputDate(dateRange.end)}
                            onChange={(e) =>
                                e.target.value && setDateRange({ ...dateRange, end: fromInputDate(e.target.value) })
                            }
                            className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-40 w-full md:w-auto"
                        />
                    </div>
                </div>

                <div className="flex lg:flex-row flex-col gap-1 md:gap-2 lg:overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-yellow-400 text-black"
                                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
