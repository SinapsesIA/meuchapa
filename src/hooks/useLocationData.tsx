
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types";

export function useLocationData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch locations
  const query = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
        
        if (error) throw error;
        return data as Location[] || [];
      } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
    }
  });
  
  // Add location
  const addMutation = useMutation({
    mutationFn: async (location: Omit<Location, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .insert([{
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state
          }])
          .select();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error adding location:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Estabelecimento adicionado",
        description: "O estabelecimento foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o estabelecimento.",
        variant: "destructive",
      });
    }
  });
  
  // Update location
  const updateMutation = useMutation({
    mutationFn: async (location: Location) => {
      if (!location.id) throw new Error("ID do estabelecimento não fornecido");
      
      try {
        const { data, error } = await supabase
          .from('locations')
          .update({
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state
          })
          .eq('id', location.id)
          .select();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating location:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Estabelecimento atualizado",
        description: "O estabelecimento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o estabelecimento.",
        variant: "destructive",
      });
    }
  });
  
  // Delete location
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting location:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Estabelecimento excluído",
        description: "O estabelecimento foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o estabelecimento.",
        variant: "destructive",
      });
    }
  });

  return {
    locations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
