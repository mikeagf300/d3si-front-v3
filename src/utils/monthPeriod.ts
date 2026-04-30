import { getChileYYYYMMDD } from "@/utils/chile-date"

export const toMonthlyPeriod = (date?: string): string => {
    const fallback = getChileYYYYMMDD(new Date()).slice(0, 7)
    if (!date) return fallback

    const normalized = date.includes("/") ? date.replace("/", "-") : date
    const [year, month] = normalized.split("-")

    if (!year || !month) return normalized

    return `${year}-${month.padStart(2, "0")}`
}
