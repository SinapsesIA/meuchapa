
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Melhoria } from "@/types/melhorias";

export function useMelhoriaDetail(id?: string) {
  const { data: melhoria, isLoading: isMelhoriaLoading } = useQuery({
    queryKey: ["melhoria", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("melhorias_ajustes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        data_solicitacao: new Date(data.data_solicitacao),
        data_atualizacao: new Date(data.data_atualizacao),
      } as Melhoria;
    },
    enabled: !!id,
  });

  return {
    melhoria,
    isMelhoriaLoading
  };
}
