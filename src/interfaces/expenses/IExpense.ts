export type ExpenseType = "administrative" | "operational" | "sales"

export interface IExpense {
    expenseID: string
    name: string
    deductibleDate: string
    amount: number
    type: ExpenseType
    storeID: string
    createdAt?: string
    updatedAt?: string
}

export interface ICreateExpense {
    name: string
    deductibleDate: string
    amount: number
    type: ExpenseType
    storeID: string
}

export interface IUpdateExpense {
    name?: string
    deductibleDate?: string
    amount?: number
    type?: ExpenseType
    storeID?: string
}
