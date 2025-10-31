"use client"

import React, { useState } from "react";
import { createTransaction } from '@/lib/api';
import { TransactionCreateDTO } from '@/lib/types';
import { revalidateTransactions } from '@/lib/actions';

export default function AddTransactionForm() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

    const handleSubmit = async (e: React.FormEvent) => {
    // 1. Previne que a página recarregue (comportamento padrão do form)
    e.preventDefault();

    // 2. Monta o objeto de dados
    const data: TransactionCreateDTO = {
      description,
      amount,
      date,
      type
    };

    try {
      // 3. Envia os dados para a API
      await createTransaction(data);

      await revalidateTransactions();

      // 4. Limpa o formulário após o sucesso
      setDescription('');
      setAmount(0);
      setDate('');
      setType('EXPENSE');

      // 5. TODO: Avisar a 'page.tsx' para recarregar a lista!

    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      // (Aqui você poderia mostrar um alerta de erro para o usuário)
    }
  };
    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 w-full max-w-2xl mb-8">
            <h3 className="text-lg font-semibold text-black mb-2">Adicionar Transação</h3>
                <div className="grid grid-cols-2 gap-4 text-black">
      
                {/* Campo Descrição */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium">Descrição</label>
                    <input 
                    type="text" 
                    id="description"
                    className="w-full p-2 border rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Campo Valor */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium">Valor (R$)</label>
                    <input 
                    type="number" 
                    id="amount"
                    className="w-full p-2 border rounded"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </div>

                {/* Campo Data */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium">Data</label>
                    <input 
                    type="date" 
                    id="date"
                    className="w-full p-2 border rounded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {/* Campo Tipo */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium">Tipo</label>
                    <select 
                    id="type"
                    className="w-full p-2 border rounded"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
                    >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                    </select>
                </div>
                </div>
                
                {/* Botão de Envio */}
                <div className="mt-4">
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Adicionar
                </button>
                </div>
        </form>
    );
}