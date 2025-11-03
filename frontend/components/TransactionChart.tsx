"use client";

import React, { useMemo } from 'react';
import { Transaction } from '@/lib/types';

// 1. Importar os componentes do GRÁFICO DE BARRAS
import { 
  ResponsiveContainer, 
  BarChart,         // <-- MUDANÇA
  Bar,              // <-- MUDANÇA
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// Define as props
interface ChartProps {
  transactions: Transaction[];
  activeFilter: "ALL" | "INCOME" | "EXPENSE"; // <-- 2. Nova prop
}

// Cores
const COLORS = {
  INCOME: '#10B981',  // Verde
  EXPENSE: '#EF4444', // Vermelho
};

export default function TransactionChart({ transactions, activeFilter }: ChartProps) {
  
  // 3. A lógica useMemo de agrupar por data continua PERFEITA.
  // Ela já lida com a lista pré-filtrada (transactionsToShow) e agrupa por dia.
  // Não precisamos mexer nela.
  const chartData = useMemo(() => {
    
    const aggregated = new Map<string, { date: string, Receita: number, Despesa: number }>();

    for (const tx of transactions) {
      const date = tx.date;
      if (!aggregated.has(date)) {
        aggregated.set(date, { date, Receita: 0, Despesa: 0 });
      }
      const entry = aggregated.get(date)!;
      if (tx.type === 'INCOME') {
        entry.Receita += tx.amount;
      } else {
        entry.Despesa += tx.amount;
      }
    }

    return Array.from(aggregated.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  }, [transactions]); 

  // 4. *** O NOVO JSX (Gráfico de Barras) ***
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart 
        data={chartData}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }} 
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        <XAxis 
          dataKey="date" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          padding={{ left: 20, right: 20 }}
        />
        
        <YAxis 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `R$ ${value}`} 
        />
        
        <Tooltip 
          formatter={(value: number) => `R$ ${value.toFixed(2)}`} 
        />
        
        <Legend />
        
        {/* 5. *** RENDERIZAÇÃO CONDICIONAL *** */}

        {/* Só mostra a barra de Receita se o filtro NÃO for "só despesa" */}
        {activeFilter !== 'EXPENSE' && (
          <Bar 
            dataKey="Receita" 
            fill={COLORS.INCOME} 
            radius={[4, 4, 0, 0]} // Cantos arredondados no topo
          />
        )}
        
        {/* Só mostra a barra de Despesa se o filtro NÃO for "só receita" */}
        {activeFilter !== 'INCOME' && (
          <Bar 
            dataKey="Despesa" 
            fill={COLORS.EXPENSE} 
            radius={[4, 4, 0, 0]} // Cantos arredondados no topo
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}