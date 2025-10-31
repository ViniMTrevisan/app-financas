export interface Transaction {
    id: number,
    description: string,
    amount: number,
    date: string, // Datas vêm como strings no JSON
    type: 'INCOME' | 'EXPENSE'
}

export interface summaryDTO {
    totalIncome: number,
    totalExpense: number,
    netBalance: number
}

export interface TransactionCreateDTO {
    description: string,
    amount: number,
    date: string,
    type: 'INCOME' | 'EXPENSE'
}