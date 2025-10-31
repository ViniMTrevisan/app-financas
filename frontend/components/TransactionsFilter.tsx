"use client";

import React from "react";
import { Transaction } from "@/lib/types";

interface TransactionFilterProps {
  transactions: Transaction[];
  onFilterChange: (filtered: Transaction[]) => void;
}

export default function TransactionFilter({
  transactions,
  onFilterChange,
}: TransactionFilterProps) {
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const handleFilterClick = (type: "ALL" | "INCOME" | "EXPENSE") => {
    setActiveFilter(type);

    if (type === "ALL") {
      onFilterChange([]); // mostra todas
    } else {
      const filtered = transactions.filter((t) => t.type === type);
      onFilterChange(filtered);
    }
  };

  return (
    <div className="flex gap-4 my-6">
      <button
        onClick={() => handleFilterClick("ALL")}
        className={`px-4 py-2 rounded-md border transition ${
          activeFilter === "ALL"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
        }`}
      >
        Todas
      </button>

      <button
        onClick={() => handleFilterClick("INCOME")}
        className={`px-4 py-2 rounded-md border transition ${
          activeFilter === "INCOME"
            ? "bg-green-600 text-white border-green-600"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
        }`}
      >
        Receitas
      </button>

      <button
        onClick={() => handleFilterClick("EXPENSE")}
        className={`px-4 py-2 rounded-md border transition ${
          activeFilter === "EXPENSE"
            ? "bg-red-600 text-white border-red-600"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
        }`}
      >
        Despesas
      </button>
    </div>
  );
}