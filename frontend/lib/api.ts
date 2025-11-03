import { Category, CategoryRequestDTO, summaryDTO, Transaction, TransactionCreateDTO } from "./types";

const API_URL = 'http://localhost:8081/api'

// busca todas as transactions
export async function getAllTransactions(): Promise<Transaction[]> {
    try {
        // chama o back
        const res = await fetch (`${API_URL}/transactions`, {
            cache: 'no-store' // garante que o valor sempre sera novo
        })
        if (!res.ok) {
            throw new Error("Failed to fetch transactions")
        }
        return res.json();
    } catch (error){
        console.error(error);
        return [];
    }
}

export async function getTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_URL}/findByCategory?categoryId=${categoryId}`, {
      cache: "no-store"
    });
    if (!res.ok) {
      throw new Error("Falha ao buscar transações por categoria");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// busca transaction por id; se nao achar retorna null
export async function getTransactionById(id: number): Promise<Transaction | null> {
    try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
            cache: "no-store"
        })
        if (!res.ok) {
            throw new Error("Failed to fetch transaction")
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// cria transacao
export async function createTransaction(data: TransactionCreateDTO): Promise<Transaction> {
    
    const res = await fetch (`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to create new transaction")
    }
    return res.json();
}

// atualiza uma transacao existente
export async function updateTransaction(
    id: number, 
    data: TransactionCreateDTO): Promise<Transaction> {
    
    const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to update transaction")
    }
    return res.json();
}

// deletar transacao
export async function deleteTransaction(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error("Failed to delete transaction")
    }
}

// sumarios

// buscar saldo total
export async function getBalance(): Promise<summaryDTO> {
    try {
        const res = await fetch(`${API_URL}/balance`, {
            cache: "no-cache"
        })
        if (!res.ok) {
            throw new Error("Failed to fetch balance")
        }
        return res.json();
     } catch (error){
        console.error(error);
        return { totalIncome: 0, totalExpense: 0, netBalance: 0};
     }
}

// buscar resumo semanal
export async function getWeeklySummary(): Promise<summaryDTO> {
    try {
        const res = await fetch(`${API_URL}/summary/weekly`, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error("Failed to fetch weekly summary")
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { totalIncome: 0, totalExpense: 0, netBalance: 0};
    }
}

// buscar resumo mensal
export async function getMonthlySummary(): Promise<summaryDTO> {
    try {
        const res = await fetch(`${API_URL}/summary/monthly`, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error("Failed to fetch monthly summary")
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { totalIncome: 0, totalExpense: 0, netBalance: 0};
    }
}

// filtros
export async function getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
        const res = await fetch(`${API_URL}/findByDate?start=${startDate}&end=${endDate}`, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error("Failed to fetch transactions by date range")
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getTransactionsByType(type: 'INCOME' | 'EXPENSE'): Promise<Transaction[]> {
    try {
        const res = await fetch(`${API_URL}/findByType?type=${type}`, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error("Failed to fetch transactions by type")
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createCategory(data: CategoryRequestDTO): Promise<Category> {
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to create new category");
    }
    return res.json();
}

export async function updateCategory(id: number, data: CategoryRequestDTO): Promise<Category> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update category");
    }
    return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error("Failed to delete category");
    }
}