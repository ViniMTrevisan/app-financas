import { getAllTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";
import TransactionsPageClient from "@/components/TransactionsPageClient";

export default async function Home() {
  // Busca inicial no servidor
  const transactions: Transaction[] = await getAllTransactions();

  // Passa os dados para o componente client
  return <TransactionsPageClient initialTransactions={transactions} />;
}