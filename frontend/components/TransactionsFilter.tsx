"use client";

import React from "react";
// 1. Importar o novo componente de botão
import { Button } from "@/components/ui/button";

interface TransactionFilterProps {
  activeFilter: "ALL" | "INCOME" | "EXPENSE";
  onFilterChange: (type: "ALL" | "INCOME" | "EXPENSE") => void;
}

export default function TransactionsFilter({
  activeFilter,
  onFilterChange,
}: TransactionFilterProps) {
  const handleFilterClick = (type: "ALL" | "INCOME" | "EXPENSE") => {
    onFilterChange(type);
  };

  // 2. Definir os filtros como um array de objetos para mais controle
  const filters = [
    { label: "Todas", value: "ALL" },
    { label: "Receitas", value: "INCOME" },
    { label: "Despesas", value: "EXPENSE" },
  ];

  return (
    <div className="flex gap-4 my-6">
      {filters.map((filter) => (
        // 3. Substituir o <button> HTML pelo <Button> do shadcn
        <Button
          key={filter.value}
          onClick={() => handleFilterClick(filter.value as "ALL" | "INCOME" | "EXPENSE")}
          // 4. Lógica de estilo:
          //    - "default" = usa a cor primária (seu verde musgo)
          //    - "outline" = usa a cor de borda (cinza/neutro)
          variant={activeFilter === filter.value ? "default" : "outline"}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}