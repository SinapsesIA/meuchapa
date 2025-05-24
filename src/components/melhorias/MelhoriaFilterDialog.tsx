import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MelhoriaCategoriaType, MelhoriaFilter, MelhoriaUrgenciaType } from "@/types/melhorias";

interface MelhoriaFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter?: MelhoriaFilter;
  setFilter?: (filter: MelhoriaFilter) => void;
}

export function MelhoriaFilterDialog({
  open,
  onOpenChange,
  filter = {} as MelhoriaFilter,
  setFilter = () => {},
}: MelhoriaFilterDialogProps) {
  // Local state for form values
  const [localFilter, setLocalFilter] = useState({
    searchTerm: filter.searchTerm || "",
    categoria: (filter.categoria || "Todas") as MelhoriaCategoriaType | "Todas",
    urgencia: (filter.urgencia || "Todas") as MelhoriaUrgenciaType | "Todas",
    dataInicio: filter.dataInicio || null,
    dataFim: filter.dataFim || null,
  });

  // Update local filter when external filter changes
  useEffect(() => {
    setLocalFilter({
      searchTerm: filter.searchTerm || "",
      categoria: (filter.categoria || "Todas") as MelhoriaCategoriaType | "Todas",
      urgencia: (filter.urgencia || "Todas") as MelhoriaUrgenciaType | "Todas",
      dataInicio: filter.dataInicio || null,
      dataFim: filter.dataFim || null,
    });
  }, [filter, open]);

  // Apply filter changes immediately
  const applyFilterChange = (newValues: Partial<typeof localFilter>) => {
    const updatedFilter = {
      ...localFilter,
      ...newValues
    };
    
    setLocalFilter(updatedFilter);
    
    // Update the parent filter state immediately
    setFilter({
      ...filter,
      searchTerm: updatedFilter.searchTerm,
      categoria: updatedFilter.categoria,
      urgencia: updatedFilter.urgencia,
      dataInicio: updatedFilter.dataInicio,
      dataFim: updatedFilter.dataFim,
      // Keep the current status filter from the main filter state
      status: filter.status,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: "",
      categoria: "Todas" as MelhoriaCategoriaType | "Todas",
      urgencia: "Todas" as MelhoriaUrgenciaType | "Todas",
      dataInicio: null,
      dataFim: null,
    };

    setLocalFilter(clearedFilters);
    setFilter({
      ...filter,
      searchTerm: "",
      categoria: "Todas" as MelhoriaCategoriaType | "Todas",
      urgencia: "Todas" as MelhoriaUrgenciaType | "Todas",
      dataInicio: null,
      dataFim: null,
      // Keep the current status filter from the main filter state
      status: filter.status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-semibold mb-4">Filtrar Solicitações</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Buscar por título ou descrição"
              value={localFilter.searchTerm}
              onChange={(e) => applyFilterChange({ searchTerm: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={localFilter.categoria}
                onValueChange={(value) => applyFilterChange({ categoria: value as MelhoriaCategoriaType | "Todas" })}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas as categorias</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Sugestão">Sugestão</SelectItem>
                  <SelectItem value="Recurso Novo">Recurso Novo</SelectItem>
                  <SelectItem value="Ajuste Visual">Ajuste Visual</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgencia">Urgência</Label>
              <Select
                value={localFilter.urgencia}
                onValueChange={(value) => applyFilterChange({ urgencia: value as MelhoriaUrgenciaType | "Todas" })}
              >
                <SelectTrigger id="urgencia">
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !localFilter.dataInicio && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilter.dataInicio ? (
                      format(localFilter.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilter.dataInicio || undefined}
                    onSelect={(date) => applyFilterChange({ dataInicio: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !localFilter.dataFim && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilter.dataFim ? (
                      format(localFilter.dataFim, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilter.dataFim || undefined}
                    onSelect={(date) => applyFilterChange({ dataFim: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClearFilters} className="gap-2">
            <XCircle className="h-4 w-4" /> Limpar
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
