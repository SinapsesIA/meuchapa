
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Download, Edit, Trash2, Loader2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocationData } from "@/hooks/useLocationData";
import { EditDialog, FormData } from "@/components/database/EditDialog";
import { Location } from "@/types";

interface LocationTabProps {
  searchTerm: string;
  onExport: () => void;
}

export function LocationTab({ searchTerm, onExport }: LocationTabProps) {
  const { locations, isLoading, isError, add, update, remove } = useLocationData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FormData>({ name: '', address: '', city: '', state: '' });

  // Filter locations based on search term
  const filteredItems = locations.filter(
    location => !searchTerm || Object.values(location).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setCurrentItem({ name: '', address: '', city: '', state: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (location: Location) => {
    setCurrentItem(location);
    setIsDialogOpen(true);
  };

  const handleSave = (data: FormData) => {
    if ((data as any).id) {
      update(data as Location);
    } else {
      add(data as Omit<Location, 'id'>);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Cadastro de Estabelecimentos</CardTitle>
        </div>
        <div className="flex gap-2">
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
          <div className="text-center text-muted-foreground py-8">
            Nenhum estabelecimento encontrado. Adicione um novo estabelecimento.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.state}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(location.id)}
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
        type="locations"
        item={currentItem}
        onSave={handleSave}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
