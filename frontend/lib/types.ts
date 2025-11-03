export interface Category {
  id: number;
  name: string;
}
export interface CategoryRequestDTO {
  name: string;
}
export interface Transaction {
    id: number,
    description: string,
    amount: number,
    date: string, // Datas vêm como strings no JSON
    type: 'INCOME' | 'EXPENSE',
    category?: Category,
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
    type: 'INCOME' | 'EXPENSE',
    categoryId: number,
}