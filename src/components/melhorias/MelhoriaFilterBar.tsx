
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MelhoriaCategoriaType, MelhoriaStatusType, MelhoriaUrgenciaType } from "@/types/melhorias";

interface MelhoriaFilterBarProps {
  onFilterChange: (filters: {
    status?: MelhoriaStatusType | "Todas";
    categoria?: MelhoriaCategoriaType | "Todas";
    urgencia?: MelhoriaUrgenciaType | "Todas";
    searchTerm?: string;
  }) => void;
  onNewClick: () => void;
  initialFilters?: {
    status?: MelhoriaStatusType | "Todas";
    categoria?: MelhoriaCategoriaType | "Todas";
    urgencia?: MelhoriaUrgenciaType | "Todas";
    searchTerm?: string;
  };
}

export function MelhoriaFilterBar({ 
  onFilterChange, 
  onNewClick,
  initialFilters = {}
}: MelhoriaFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [statusFilter, setStatusFilter] = useState<MelhoriaStatusType | "Todas">(initialFilters.status || "Todas");
  const [categoriaFilter, setCategoriaFilter] = useState<MelhoriaCategoriaType | "Todas">(initialFilters.categoria || "Todas");
  const [urgenciaFilter, setUrgenciaFilter] = useState<MelhoriaUrgenciaType | "Todas">(initialFilters.urgencia || "Todas");

  // Update filters when external filters change
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.searchTerm !== undefined) setSearchTerm(initialFilters.searchTerm);
      if (initialFilters.status !== undefined) setStatusFilter(initialFilters.status);
      if (initialFilters.categoria !== undefined) setCategoriaFilter(initialFilters.categoria);
      if (initialFilters.urgencia !== undefined) setUrgenciaFilter(initialFilters.urgencia);
    }
  }, [initialFilters]);

  const handleFilterChange = (
    newStatus?: MelhoriaStatusType | "Todas",
    newCategoria?: MelhoriaCategoriaType | "Todas",
    newUrgencia?: MelhoriaUrgenciaType | "Todas",
    newSearchTerm?: string
  ) => {
    const status = newStatus !== undefined ? newStatus : statusFilter;
    const categoria = newCategoria !== undefined ? newCategoria : categoriaFilter;
    const urgencia = newUrgencia !== undefined ? newUrgencia : urgenciaFilter;
    const search = newSearchTerm !== undefined ? newSearchTerm : searchTerm;
    
    setStatusFilter(status);
    setCategoriaFilter(categoria);
    setUrgenciaFilter(urgencia);
    if (newSearchTerm !== undefined) setSearchTerm(newSearchTerm);
    
    // Apply filters immediately
    onFilterChange({ status, categoria, urgencia, searchTerm: search });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar solicitações..."
          className="pl-8 w-full md:w-[300px]"
          value={searchTerm}
          onChange={(e) => handleFilterChange(undefined, undefined, undefined, e.target.value)}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 md:ml-auto">
        <Select
          value={urgenciaFilter}
          onValueChange={(value) => handleFilterChange(undefined, undefined, value as MelhoriaUrgenciaType | "Todas")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Urgência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as Urgências</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => handleFilterChange(value as MelhoriaStatusType | "Todas")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todos os Status</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Em análise">Em análise</SelectItem>
            <SelectItem value="Em desenvolvimento">Em desenvolvimento</SelectItem>
            <SelectItem value="Implementado">Implementado</SelectItem>
            <SelectItem value="Rejeitado">Rejeitado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoriaFilter}
          onValueChange={(value) => handleFilterChange(undefined, value as MelhoriaCategoriaType | "Todas")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as Categorias</SelectItem>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="Sugestão">Sugestão</SelectItem>
            <SelectItem value="Recurso Novo">Recurso Novo</SelectItem>
            <SelectItem value="Ajuste Visual">Ajuste Visual</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onNewClick} className="whitespace-nowrap">
          + Nova Solicitação
        </Button>
      </div>
    </div>
  );
}
