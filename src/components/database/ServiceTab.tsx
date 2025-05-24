
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useServiceData } from "@/hooks/useServiceData";
import { EditDialog, FormData } from "@/components/database/EditDialog";
import { Service } from "@/types";

interface ServiceTabProps {
  searchTerm: string;
  onExport: () => void;
}

export function ServiceTab({ searchTerm, onExport }: ServiceTabProps) {
  const { services, isLoading, isError, add, update, remove } = useServiceData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FormData>({ name: '', description: '', price: 0 });

  // Filter services based on search term
  const filteredItems = services.filter(
    service => !searchTerm || Object.values(service).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setCurrentItem({ name: '', description: '', price: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentItem(service);
    setIsDialogOpen(true);
  };

  const handleSave = (data: FormData) => {
    if ((data as any).id) {
      update(data as Service);
    } else {
      add(data as Omit<Service, 'id'>);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos de Serviços</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço Base (R$)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.price?.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(service.id)}
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
        type="services"
        item={currentItem}
        onSave={handleSave}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
