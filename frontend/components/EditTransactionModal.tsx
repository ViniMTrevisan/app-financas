"use client";

import React, { useState, useEffect } from "react";
import { Transaction, TransactionCreateDTO, Category } from "@/lib/types";
import { updateTransaction, getAllCategories } from "@/lib/api"; 

// Imports do shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"; 

interface Props {
  transaction: Transaction;
  onSave: (updated: Transaction) => void;
  onCancel: () => void;
  categories: Category[]; 
}

export default function EditTransactionModal({ transaction, onSave, onCancel, categories }: Props) {
  // Estados do formulário
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(transaction.date);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);
  const [loading, setLoading] = useState(false);
  
  // Estado de Categoria (à prova de nulo)
  const [categoryId, setCategoryId] = useState(
    String(transaction.category?.id || '') 
  );
  
  // O 'useEffect' FOI REMOVIDO (pois 'categories' vem por prop)

  const handleSave = async () => {
    if (!categoryId) {
        toast.error("Erro de Validação", { description: "Por favor, selecione uma categoria." });
        return;
    }
    
    setLoading(true);
    const data: TransactionCreateDTO = { 
      description, 
      amount: parseFloat(amount) || 0, 
      date, 
      type,
      categoryId: parseInt(categoryId)
    };
    
    try {
      const updated = await updateTransaction(transaction.id, data);
      onSave(updated); 
      
      toast.success("Transação Atualizada", {
        description: `"${updated.description}" foi salva com sucesso.`,
      });
      
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      toast.error("Erro ao Atualizar", {
        description: "Não foi possível salvar as alterações.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3 dark:[color-scheme:dark]" // *** A CORREÇÃO ESTÁ AQUI ***
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select
              value={type}
              onValueChange={(value: "INCOME" | "EXPENSE") => setType(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
                <SelectItem value="INCOME">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo Categoria */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-edit" className="text-right">
              Categoria
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger className="col-span-3" id="category-edit">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {/* A lista de 'categories' agora vem das props */}
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}