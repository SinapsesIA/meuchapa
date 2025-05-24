
import { useMelhoriasFilter } from "./melhorias/useMelhoriasFilter";
import { useMelhoriasList } from "./melhorias/useMelhoriasList";
import { useMelhoriaDetail } from "./melhorias/useMelhoriaDetail";
import { useMelhoriaComentarios } from "./melhorias/useMelhoriaComentarios";
import { useMelhoriaMutations } from "./melhorias/useMelhoriaMutations";

export function useMelhorias() {
  // Use the filter hook
  const { filter, setFilter } = useMelhoriasFilter();
  
  // Use the list hook with the current filter
  const { melhorias, isLoading } = useMelhoriasList(filter);
  
  // Use the detail hook with the selected ID from filter
  const { melhoria, isMelhoriaLoading } = useMelhoriaDetail(filter.id);
  
  // Use the comentarios hook with the selected ID from filter
  const { comentarios, isComentariosLoading } = useMelhoriaComentarios(filter.id);
  
  // Use the mutations hook
  const { createMelhoria, updateMelhoria, createComentario } = useMelhoriaMutations();

  return {
    melhorias,
    melhoria,
    comentarios,
    isLoading,
    isMelhoriaLoading,
    isComentariosLoading,
    filter,
    setFilter,
    createMelhoria,
    updateMelhoria,
    createComentario,
  };
}
