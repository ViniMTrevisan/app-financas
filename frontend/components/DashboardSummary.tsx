import React from "react";
import { getBalance, getWeeklySummary, getMonthlySummary } from "@/lib/api";
import { summaryDTO } from "@/lib/types";

export default async function DashboardSummary() {
  let balance: summaryDTO | null = null;
  let weekly: summaryDTO | null = null;
  let monthly: summaryDTO | null = null;

  try {
    [balance, weekly, monthly] = await Promise.all([
      getBalance(),
      getWeeklySummary(),
      getMonthlySummary(),
    ]);
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }

  return (
    <section className="w-full max-w-2xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        title="Saldo Total"
        value={balance ? balance.netBalance : 0}
        highlight
      />
      <Card
        title="Resumo Semanal"
        value={weekly ? weekly.netBalance : 0}
      />
      <Card
        title="Resumo Mensal"
        value={monthly ? monthly.netBalance : 0}
      />
    </section>
  );
}

// Componente interno para reaproveitar estilo
function Card({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  const color = value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div
      className={`bg-white shadow rounded-lg p-4 text-center ${
        highlight ? "border-2 border-blue-500" : ""
      }`}
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>
        R$ {value.toFixed(2)}
      </p>
    </div>
  );
}