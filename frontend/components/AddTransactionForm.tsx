"use client";

import React, { useState, useEffect } from "react";
import { createTransaction } from "@/lib/api"; 
import { TransactionCreateDTO, Transaction, Category } from "@/lib/types";

// (imports do shadcn)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";

interface AddTransactionFormProps {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: Category[]; 
}

export default function AddTransactionForm({ setTransactions, categories }: AddTransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [categoryId, setCategoryId] = useState(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     if (categories.length > 0 && !categoryId) {
        setCategoryId(String(categories[0].id));
     }
  }, [categories, categoryId]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      categoryId: parseInt(categoryId),
    };
    try {
      const newTransaction = await createTransaction(data);
      setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
      toast.success("Transação Adicionada", {
        description: `"${newTransaction.description}" foi salva com sucesso.`,
      });
      setDescription('');
      setAmount('0');
      setDate('');
      setType('EXPENSE');
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast.error("Erro ao Salvar", {
        description: "Não foi possível adicionar a transação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Adicionar Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                type="text" 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Ex: Almoço no café"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input 
                type="number" 
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input 
                type="date" 
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                // *** A CORREÇÃO ESTÁ AQUI ***
                // Diz ao navegador para usar os controles claros para este input
                className="dark:[color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={type} 
                onValueChange={(value: "INCOME" | "EXPENSE") => setType(value)}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                  <SelectItem value="INCOME">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}