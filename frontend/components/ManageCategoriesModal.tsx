"use client";

import React, { useState } from "react";
import { Category, CategoryRequestDTO } from "@/lib/types";
import { createCategory, deleteCategory, updateCategory } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TrashIcon, PencilIcon, XIcon, CheckIcon } from "lucide-react"; 
import DeleteCategoryModal from "./DeleteCategoryModal"; 

interface Props {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageCategoriesModal({ categories, setCategories, isOpen, onClose }: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loadingEdit, setLoadingEdit] = useState<number | null>(null); 

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoadingAdd(true);
    try {
      const data: CategoryRequestDTO = { name: newCategoryName };
      const newCategory = await createCategory(data);
      setCategories((prev) => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
      toast.success("Categoria criada", { description: `"${newCategory.name}" foi adicionada.` });
    } catch (error: any) {
      toast.error("Erro ao criar", { description: error.message || "Não foi possível criar a categoria." });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    setLoadingEdit(id); 
    try {
      const data: CategoryRequestDTO = { name: editingCategoryName };
      const updatedCategory = await updateCategory(id, data);

      setCategories((prev) => 
        prev.map((c) => (c.id === id ? updatedCategory : c))
          .sort((a, b) => a.name.localeCompare(b.name)) 
      );
      
      toast.success("Categoria atualizada", { description: `"${updatedCategory.name}" foi salva.` });
      handleCancelEdit(); 
    } catch (error: any) {
      toast.error("Erro ao atualizar", { description: error.message || "Não foi possível salvar." });
    } finally {
      setLoadingEdit(null);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      const deletedCategory = categories.find(c => c.id === id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      
      toast.error("Categoria deletada", { 
        description: `"${deletedCategory?.name}" foi removida.` 
      });
      
      setDeleteTarget(null);
    } catch (error) { 
      toast.error("Erro ao deletar", { description: "Não foi possível deletar a categoria." });
      setDeleteTarget(null);
    }
  };

  return (
    <> 
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              disabled={loadingAdd}
            />
            <Button type="submit" disabled={loadingAdd}>
              {loadingAdd ? "..." : "Adicionar"}
            </Button>
          </form>

          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            
            {/* 1. *** CORREÇÃO: 'text-black' REMOVIDO *** */}
            <h4 className="font-medium">Categorias Existentes</h4>
            
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma categoria encontrada.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex justify-between items-center p-2 rounded-md border">
                  
                  {editingCategoryId === category.id ? (
                    // --- MODO DE EDIÇÃO ---
                    // (O Input aqui já herda a cor 'text-foreground' (clara) do tema)
                    <>
                      <Input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="h-9"
                        disabled={loadingEdit === category.id}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleCancelEdit}
                        disabled={loadingEdit === category.id}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={loadingEdit === category.id}
                      >
                        {loadingEdit === category.id ? "..." : <CheckIcon className="h-4 w-4" />}
                      </Button>
                    </>
                  ) : (
                    // --- MODO DE VISUALIZAÇÃO (Padrão) ---
                    <>
                      {/* 2. *** CORREÇÃO: 'text-black' REMOVIDO *** */}
                      <span className="">{category.name}</span>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEditClick(category)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget(category)} 
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          onCancel={() => setDeleteTarget(null)} 
          onConfirm={handleDeleteCategory}    
        />
      )}
    </>
  );
}