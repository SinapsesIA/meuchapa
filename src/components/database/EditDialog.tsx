import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Supplier, Vehicle, Location, Service } from "@/types";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useServiceData } from "@/hooks/useServiceData";
import { useVehicleData } from "@/hooks/useVehicleData";
import { useLocationData } from "@/hooks/useLocationData";

interface SupplierFormData extends Omit<Supplier, 'id'> {
  id?: string;
}

interface VehicleFormData extends Omit<Vehicle, 'id'> {
  id?: string;
}

interface LocationFormData extends Omit<Location, 'id'> {
  id?: string;
}

interface ServiceFormData extends Omit<Service, 'id'> {
  id?: string;
}

export type FormData = SupplierFormData | VehicleFormData | LocationFormData | ServiceFormData;

interface EditDialogProps {
  type: 'suppliers' | 'vehicles' | 'locations' | 'services';
  item: FormData;
  onSave: (data: FormData) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDialog({ type, item, onSave, open, onOpenChange }: EditDialogProps) {
  const [formData, setFormData] = useState<FormData>(item);

  // Reset form data when item changes
  useEffect(() => {
    setFormData(item);
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSave(formData);
  };

  const getFields = () => {
    switch (type) {
      case 'suppliers':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
              <Input
                id="name"
                placeholder="Nome"
                value={(formData as SupplierFormData).name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="document" className="block text-sm font-medium mb-1">CNPJ</label>
              <Input
                id="document"
                placeholder="CNPJ"
                value={(formData as SupplierFormData).document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium mb-1">Cidade</label>
              <Input
                id="city"
                placeholder="Cidade"
                value={(formData as SupplierFormData).city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium mb-1">Contato</label>
              <Input
                id="contact"
                placeholder="Contato"
                value={(formData as SupplierFormData).contact || ''}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </>
        );
      case 'vehicles':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="plate" className="block text-sm font-medium mb-1">Placa</label>
              <Input
                id="plate"
                placeholder="Placa"
                value={(formData as VehicleFormData).plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium mb-1">Tipo</label>
              <Input
                id="type"
                placeholder="Tipo"
                value={(formData as VehicleFormData).type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="capacity" className="block text-sm font-medium mb-1">Capacidade</label>
              <Input
                id="capacity"
                placeholder="Capacidade"
                value={(formData as VehicleFormData).capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium mb-1">Fornecedor</label>
              <Input
                id="supplier"
                placeholder="Fornecedor"
                value={(formData as VehicleFormData).supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </>
        );
      case 'locations':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
              <Input
                id="name"
                placeholder="Nome"
                value={(formData as LocationFormData).name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço</label>
              <Input
                id="address"
                placeholder="Endereço"
                value={(formData as LocationFormData).address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium mb-1">Cidade</label>
              <Input
                id="city"
                placeholder="Cidade"
                value={(formData as LocationFormData).city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">Estado</label>
              <Input
                id="state"
                placeholder="Estado"
                value={(formData as LocationFormData).state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </>
        );
      case 'services':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
              <Input
                id="name"
                placeholder="Nome"
                value={(formData as ServiceFormData).name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
              <Input
                id="description"
                placeholder="Descrição"
                value={(formData as ServiceFormData).description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Preço</label>
              <Input
                id="price"
                placeholder="Preço"
                type="number"
                value={(formData as ServiceFormData).price?.toString() || '0'}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {(item as any).id ? 'Editar' : 'Adicionar'} {
              type === 'suppliers' ? 'Transportadora' :
              type === 'vehicles' ? 'Veículo' :
              type === 'locations' ? 'Estabelecimento' : 'Serviço'
            }
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {(item as any).id ? 'editar' : 'adicionar'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {getFields()}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
