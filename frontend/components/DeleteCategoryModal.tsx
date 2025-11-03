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
import { Category } from "@/lib/types";

interface Props {
  category: Category;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

export default function DeleteCategoryModal({ category, onConfirm, onCancel }: Props) {
  
  const handleConfirm = () => {
    onConfirm(category.id);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          
          {/* *** A CORREÇÃO ESTÁ AQUI *** */}

          {/* 1. O texto principal (que é um <p>) */}
          <DialogDescription className="pt-2">
            Tem certeza que deseja excluir a categoria:{" "}
            <strong>{category.name}</strong>?
          </DialogDescription>
          
          {/* 2. O aviso (agora como um <div> irmão, FORA do <DialogDescription>) */}
          <div className="text-red-600 text-sm pt-2"> {/* mudei de mt-2 para pt-2 */}
            Aviso: Transações associadas a esta categoria não serão excluídas, mas ficarão = Sem Categoria.
          </div>
          
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