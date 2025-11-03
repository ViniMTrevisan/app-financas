"use client";

import React, { useEffect, useState } from "react";
import { getBalance, getWeeklySummary, getMonthlySummary } from "@/lib/api";
import { summaryDTO, Transaction } from "@/lib/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardProps {
  transactions: Transaction[];
}

export default function DashboardSummary({ transactions }: DashboardProps) {
  const [balance, setBalance] = useState<summaryDTO | null>(null);
  const [weekly, setWeekly] = useState<summaryDTO | null>(null);
  const [monthly, setMonthly] = useState<summaryDTO | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [b, w, m] = await Promise.all([
          getBalance(),
          getWeeklySummary(),
          getMonthlySummary(),
        ]);
        setBalance(b);
        setWeekly(w);
        setMonthly(m);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      }
    }
    fetchSummary();
  }, [transactions]);

  return (
    <section className="w-full max-w-2xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard
        title="Saldo Total"
        value={balance ? balance.netBalance : 0}
        highlight
      />
      <SummaryCard
        title="Resumo Semanal"
        value={weekly ? weekly.netBalance : 0}
        highlight
      />
      <SummaryCard
        title="Resumo Mensal"
        value={monthly ? monthly.netBalance : 0}
        highlight
      />
    </section>
  );
}

function SummaryCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  const color = value >= 0 ? "text-green-600" : "text-red-600";
  const finalColor = value === 0 ? "text-gray-500" : color;

  return (
    <Card className={highlight ? "border-2 border-primary" : ""}>
      <CardHeader className="pb-2 text-center">
        
        {/* *** CORREÇÃO: 'text-muted-foreground' é a cor cinza claro do shadcn *** */}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className={`text-2xl font-bold ${finalColor}`}>
          {value < 0 ? "-R$ " : "R$ "}
          {Math.abs(value).toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}