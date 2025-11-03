"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Transaction } from "@/lib/types"; // 1. Importa o tipo Transaction
import { toast } from "sonner"; // 2. Importa o toast

interface Props {
  transaction: Transaction; // 3. Recebe a Transação inteira
  onConfirm: (id: number) => void; // 4. Informa o Pai qual ID confirmar
  onCancel: () => void;
}

export default function DeleteTransactionModal({ transaction, onConfirm, onCancel }: Props) {
  
  const handleConfirm = () => {
    // 5. Chama a função do Pai, passando o ID da transação
    onConfirm(transaction.id);

    // 6. Mostra o toast vermelho (consistência)
    toast.error("Transação Excluída", {
      description: `A transação "${transaction.description}" foi removida.`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja excluir a transação:{" "}
            <strong>{transaction.description}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}