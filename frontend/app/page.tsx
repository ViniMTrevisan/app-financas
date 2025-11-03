import TransactionsPageClient from "@/components/TransactionsPageClient";

// Esta página agora é um "Server Component" simples
// que renderiza o "Client Component" que fará todo o trabalho.
export default function Home() {
  // Não buscamos mais dados aqui.
  // Passamos um array vazio, o cliente vai se popular.
  return <TransactionsPageClient initialTransactions={[]} />;
}