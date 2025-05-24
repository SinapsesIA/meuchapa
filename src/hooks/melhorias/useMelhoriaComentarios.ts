
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MelhoriaComentario } from "@/types/melhorias";

export function useMelhoriaComentarios(melhoriaId?: string) {
  const { data: comentarios, isLoading: isComentariosLoading } = useQuery({
    queryKey: ["comentarios", melhoriaId],
    queryFn: async () => {
      if (!melhoriaId) return [];
      
      const { data, error } = await supabase
        .from("melhorias_comentarios")
        .select("*")
        .eq("melhoria_id", melhoriaId)
        .order("data_criacao", { ascending: true });
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item,
        data_criacao: new Date(item.data_criacao),
      })) as MelhoriaComentario[];
    },
    enabled: !!melhoriaId,
  });

  return {
    comentarios,
    isComentariosLoading
  };
}
