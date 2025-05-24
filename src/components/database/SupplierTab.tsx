
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Loader2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupplierData } from "@/hooks/useSupplierData";
import { EditDialog, FormData } from "@/components/database/EditDialog";
import { Supplier } from "@/types";
import { DialogTrigger } from "@/components/ui/dialog";

interface SupplierTabProps {
  searchTerm: string;
  onExport: () => void;
}

export function SupplierTab({ searchTerm, onExport }: SupplierTabProps) {
  const { suppliers, isLoading, isError, add, update, remove } = useSupplierData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FormData>({ name: '', document: '', city: '', contact: '' });

  // Filter suppliers based on search term
  const filteredItems = suppliers.filter(
    supplier => !searchTerm || Object.values(supplier).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setCurrentItem({ name: '', document: '', city: '', contact: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentItem(supplier);
    setIsDialogOpen(true);
  };

  const handleSave = (data: FormData) => {
    console.log("Saving supplier data:", data);
    if ((data as any).id) {
      update(data as Supplier);
    } else {
      add(data as Omit<Supplier, 'id'>);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cadastro de Transportadoras</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando...</span>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Erro ao carregar os dados. Por favor, tente novamente.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "Nenhuma transportadora encontrada para a busca." : "Nenhuma transportadora cadastrada."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.document}</TableCell>
                  <TableCell>{supplier.city || '-'}</TableCell>
                  <TableCell>{supplier.contact || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <EditDialog 
        type="suppliers"
        item={currentItem}
        onSave={handleSave}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
