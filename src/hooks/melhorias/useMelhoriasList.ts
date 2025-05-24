
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Melhoria, MelhoriaFilter } from "@/types/melhorias";

export function useMelhoriasList(filter: MelhoriaFilter) {
  const { data: melhorias, isLoading } = useQuery({
    queryKey: ["melhorias", filter],
    queryFn: async () => {
      let query = supabase.from("melhorias_ajustes").select("*");
      
      // Apply filters
      if (filter.status && filter.status !== "Todas") {
        query = query.eq("status", filter.status);
      }
      
      if (filter.categoria && filter.categoria !== "Todas") {
        query = query.eq("categoria", filter.categoria);
      }
      
      if (filter.urgencia && filter.urgencia !== "Todas") {
        query = query.eq("urgencia", filter.urgencia);
      }
      
      if (filter.dataInicio) {
        query = query.gte("data_solicitacao", filter.dataInicio.toISOString());
      }
      
      if (filter.dataFim) {
        query = query.lte("data_solicitacao", filter.dataFim.toISOString());
      }
      
      if (filter.searchTerm) {
        query = query.or(`titulo.ilike.%${filter.searchTerm}%,descricao.ilike.%${filter.searchTerm}%`);
      }
      
      // Handle sorting
      if (filter.sortField === 'urgencia') {
        // For urgency, we need to use a simpler approach
        // First sort by urgency directly
        query = query.order('urgencia', { 
          ascending: filter.sortOrder === 'asc'
        });
      } else if (filter.sortField) {
        // Standard field sorting
        query = query.order(filter.sortField, { 
          ascending: filter.sortOrder === 'asc'
        });
      }
      
      // Always add data_atualizacao as secondary sort
      query = query.order("data_atualizacao", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching melhorias:", error);
        throw error;
      }
      
      return data.map((item: any) => ({
        ...item,
        data_solicitacao: new Date(item.data_solicitacao),
        data_atualizacao: new Date(item.data_atualizacao),
      })) as Melhoria[];
    }
  });

  return {
    melhorias,
    isLoading
  };
}
