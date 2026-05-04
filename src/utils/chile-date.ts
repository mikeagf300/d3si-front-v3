const CHILE_TZ = "America/Santiago"

const chileYmdFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

type ChileDateParts = {
    year: number
    month: number
    day: number
    dayNumber: number
}

export const isYYYYMMDD = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)

export const getChileYYYYMMDD = (date: Date): string => chileYmdFormatter.format(date)

export const toChileMiddayUTC = (yyyyMmDd: string): Date => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
}

export const getChileDateMeta = (date: Date): ChileDateParts => {
    const parts = chileYmdFormatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
        if (part.type === "year" || part.type === "month" || part.type === "day") acc[part.type] = part.value
        return acc
    }, {})

    const year = Number(parts.year)
    const month = Number(parts.month) - 1
    const day = Number(parts.day)

    return {
        year,
        month,
        day,
        dayNumber: Date.UTC(year, month, day),
    }
}
