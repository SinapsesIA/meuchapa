
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVehicleData } from "@/hooks/useVehicleData";
import { EditDialog, FormData } from "@/components/database/EditDialog";
import { Vehicle } from "@/types";

interface VehicleTabProps {
  searchTerm: string;
  onExport: () => void;
}

export function VehicleTab({ searchTerm, onExport }: VehicleTabProps) {
  const { vehicles, isLoading, isError, add, update, remove } = useVehicleData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FormData>({ plate: '', type: '', capacity: '', supplier: '' });

  // Filter vehicles based on search term
  const filteredItems = vehicles.filter(
    vehicle => !searchTerm || Object.values(vehicle).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setCurrentItem({ plate: '', type: '', capacity: '', supplier: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setCurrentItem(vehicle);
    setIsDialogOpen(true);
  };

  const handleSave = (data: FormData) => {
    if ((data as any).id) {
      update(data as Vehicle);
    } else {
      add(data as Omit<Vehicle, 'id'>);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cadastro de Veículos</CardTitle>
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
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.supplier}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(vehicle.id)}
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
        type="vehicles"
        item={currentItem}
        onSave={handleSave}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
