
import { useState } from "react";
import { MelhoriaCategoriaType, MelhoriaFilter, MelhoriaStatusType, MelhoriaUrgenciaType } from "@/types/melhorias";

export function useMelhoriasFilter() {
  const [filter, setFilter] = useState<MelhoriaFilter>({
    status: "Todas",
    categoria: "Todas",
    urgencia: "Todas",
    searchTerm: "",
    sortField: "urgencia",
    sortOrder: "desc", // Changed from 'asc' to 'desc' to show high urgency first
  });

  const updateFilter = (newFilter: Partial<MelhoriaFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  return {
    filter,
    setFilter: updateFilter
  };
}
