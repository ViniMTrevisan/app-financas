"use client";

import React, { useState } from "react";
import { Transaction } from "@/lib/types";
import AddTransactionForm from "@/components/AddTransactionForm";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionsFilter from "@/components/TransactionsFilter";

interface Props {
  initialTransactions: Transaction[];
}

export default function TransactionsPageClient({ initialTransactions }: Props) {
  const [filterTransactions, setFilterTransactions] = useState<Transaction[]>([]);

  // Se há filtro ativo, mostra ele; senão mostra todas as transações iniciais
  const transactionsToShow =
    filterTransactions.length > 0 ? filterTransactions : initialTransactions;

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Meu App de Finanças
      </h1>

      <DashboardSummary />
      <AddTransactionForm />

      <TransactionsFilter 
      transactions={initialTransactions}
      onFilterChange={setFilterTransactions} />

      <div className="bg-white shadow rounded-lg p-4 w-full max-w-2xl mt-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Transações</h2>
        <ul className="divide-y divide-gray-200">
          {transactionsToShow.length > 0 ? (
            transactionsToShow.map((tx) => (
              <li
                key={tx.id}
                className="py-2 flex justify-between text-black"
              >
                <span>{tx.description}</span>
                <span
                  className={
                    tx.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }
                >
                  {tx.type === "INCOME" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                </span>
              </li>
            ))
          ) : (
            <li className="py-2 text-gray-500 text-center">
              Nenhuma transação encontrada.
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}