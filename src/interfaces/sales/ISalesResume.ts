export interface IMetaMensual {
    id: string
    period: string
    targetAmount: number
    createdAt: string
    updatedAt: string
}

export interface PaymentTypeResumee {
    key: string
    count: number
    total: number
}

export interface PeriodSummary {
    count: number
    total: number
}

export interface IResume {
    groupedByPaymentType: PaymentTypeResumee[]
    groupedByStatus: PaymentTypeResumee[]
    periodSummary: {
        today: PeriodSummary
        yesterday: PeriodSummary
        month: PeriodSummary
    }
}

// Compatibilidad para helpers antiguos que todavía trabajan con un resumen más amplio.
export interface ICountAmountResume {
    count: number
    amount: number
}

export interface ISalesResume {
    today: {
        total: ICountAmountResume
        efectivo: ICountAmountResume
        debitoCredito: ICountAmountResume
    }
    yesterday: {
        total: ICountAmountResume
        efectivo: ICountAmountResume
        debitoCredito: ICountAmountResume
    }
    last7: {
        total: ICountAmountResume
        efectivo: ICountAmountResume
        debitoCredito: ICountAmountResume
    }
    month: {
        total: ICountAmountResume
        efectivo: ICountAmountResume
        debitoCredito: ICountAmountResume
    }
}
