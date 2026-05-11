export const pickFirst = <T>(...values: Array<T | null | undefined>): T | undefined =>
    values.find((value): value is T => value !== null && value !== undefined)

export const pickArray = <T>(...values: Array<T[] | null | undefined>): T[] => {
    const found = values.find((value): value is T[] => Array.isArray(value))
    return found ?? []
}

export const toNumber = (value: number | string | null | undefined): number => Number(value ?? 0)

export const toStringValue = (value: string | number | null | undefined): string => String(value ?? "")
