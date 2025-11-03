"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Transaction, Category } from "@/lib/types"; 
import { getAllTransactions, deleteTransaction, getAllCategories } from "@/lib/api";

// Nossos Componentes de UI
import AddTransactionForm from "@/components/AddTransactionForm";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionsFilter from "@/components/TransactionsFilter";
import EditTransactionModal from "@/components/EditTransactionModal";
import DeleteTransactionModal from "@/components/DeleteTransactionModal";
import TransactionChart from '@/components/TransactionChart';
import DateRangeFilter from "@/components/DateRangeFilter";
import CategoryFilter from "@/components/CategoryFilter"; 
import ManageCategoriesModal from "@/components/ManageCategoriesModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
  initialTransactions: Transaction[];
}

export default function TransactionsPageClient({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [activeFilter, setActiveFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [isLoading, setIsLoading] = useState(true); 
  const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({
    start: null,
    end: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">("ALL");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTransactionTarget, setDeleteTransactionTarget] = useState<Transaction | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [transactionsData, categoriesData] = await Promise.all([
          getAllTransactions(),
          getAllCategories()
        ]);
        
        const sortedData = transactionsData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedData); 
        setCategories(categoriesData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
      setIsLoading(false);
    }
    loadInitialData(); 
  }, []); 

  // *** A CORREÇÃO ESTÁ AQUI (DENTRO DO useMemo) ***
  const transactionsToShow = useMemo(() => {
    // 1. Armazena os valores de data de forma segura
    const { start, end } = dateRange;

    return transactions
      .filter(tx => {
        // 2. Filtro de TIPO
        if (activeFilter === 'ALL') return true;
        return tx.type === activeFilter;
      })
      .filter(tx => {
        // 3. Filtro de DATA (agora 100% seguro contra 'null')
        // Se 'start' ou 'end' forem nulos, o filtro de data é ignorado
        if (!start || !end) return true;
        return tx.date >= start && tx.date <= end;
      })
      .filter(tx => {
        // 4. Filtro de CATEGORIA
        if (selectedCategory === 'ALL') return true;
        return tx.category && tx.category.id === selectedCategory;
      });
      
  }, [transactions, activeFilter, dateRange, selectedCategory]); 

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );
      setDeleteTransactionTarget(null); 
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      toast.error("Erro ao Deletar", {
        description: "Não foi possível remover esta transação."
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      
      <h1 className="text-4xl font-bold mb-8">Meu App de Finanças</h1>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- COLUNA ESQUERDA (AÇÕES / FORMULÁRIOS) --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AddTransactionForm 
            setTransactions={setTransactions} 
            categories={categories} 
          />
          <CategoryFilter 
            onCategoryChange={setSelectedCategory} 
            categories={categories}
            onManageClick={() => setIsCategoryModalOpen(true)}
          />
          <DateRangeFilter 
            onFilter={(range) => setDateRange(range)} 
            onClear={() => setDateRange({ start: null, end: null })} 
          />
        </div>

        {/* --- COLUNA DIREITA (DADOS / RESULTADOS) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <DashboardSummary transactions={transactions} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visão Geral</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <TransactionsFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <TransactionChart 
                transactions={transactionsToShow} 
                activeFilter={activeFilter} 
              />
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
                {isLoading ? (
                  <li className="py-2 text-gray-500 text-center">Carregando...</li>
                ) : transactionsToShow.length > 0 ? (
                  transactionsToShow.map((tx) => (
                    <li key={tx.id} className="py-2 flex items-center gap-4">
                      
                      <div className="flex-grow">
                        <span className="font-medium block">{tx.description}</span>
                        <span className="text-xs text-muted-foreground block">
                          {tx.category ? tx.category.name : 'Sem Categoria'}
                        </span>
                      </div>

                      <div className="flex-shrink-0 w-32 text-right">
                        <span className={`font-medium ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "INCOME" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground block">{tx.date}</span>
                      </div>

                      <div className="flex-shrink-0 flex flex-col gap-1 ml-2">
                        <Button
                          variant="ghost" size="sm"       
                          onClick={() => setEditTransaction(tx)}
                          className="text-blue-600 hover:text-blue-700 h-6"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost" size="sm"       
                          onClick={() => setDeleteTransactionTarget(tx)}
                          className="text-red-600 hover:text-red-700 h-6"
                        >
                          Excluir
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-gray-500 text-center">Nenhuma transação encontrada.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- MODAIS --- */}
      {isCategoryModalOpen && (
        <ManageCategoriesModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {editTransaction && (
        <EditTransactionModal
          transaction={editTransaction}
          onCancel={() => setEditTransaction(null)}
          onSave={(updated) => {
            setTransactions((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
            setEditTransaction(null);
          }}
          categories={categories}
        />
      )}
      {deleteTransactionTarget && (
        <DeleteTransactionModal
          transaction={deleteTransactionTarget} 
          onCancel={() => setDeleteTransactionTarget(null)}
          onConfirm={handleDeleteTransaction}
        />
      )}
    </main>
  );
}