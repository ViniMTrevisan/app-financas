"use client";

import React, { useState } from "react";
import { Category } from "@/lib/types";
// import { getAllCategories } from "@/lib/api"; // <-- Não busca mais dados
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: Category[]; // <-- Recebe a lista do pai
  onCategoryChange: (categoryId: number | "ALL") => void;
  onManageClick: () => void; // <-- Função para abrir o modal
}

export default function CategoryFilter({ categories, onCategoryChange, onManageClick }: CategoryFilterProps) {
  const [selected, setSelected] = useState<string>("ALL");
  
  // O 'useEffect' FOI REMOVIDO

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === "ALL") {
      onCategoryChange("ALL");
    } else {
      onCategoryChange(parseInt(value));
    }
  };

  const handleClear = () => {
    handleChange("ALL");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Div para alinhar Label e Botão */}
          <div className="flex justify-between items-center">
            <Label htmlFor="category-filter">Filtrar por Categoria</Label>
            <Button variant="link" className="p-0 h-auto" onClick={onManageClick}>
              Gerenciar
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={selected} onValueChange={handleChange}>
              <SelectTrigger id="category-filter" className="flex-1">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as Categorias</SelectItem>
                {/* A lista de 'categories' agora vem das props */}
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={selected === "ALL"}
            >
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}