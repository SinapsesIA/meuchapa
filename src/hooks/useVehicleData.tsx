
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "@/types";

export function useVehicleData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch vehicles
  const query = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');
      
      if (error) throw error;
      return data as Vehicle[];
    }
  });
  
  // Add vehicle
  const addMutation = useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, 'id'>) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          plate: vehicle.plate,
          type: vehicle.type,
          capacity: vehicle.capacity,
          supplier: vehicle.supplier
        }]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o veículo.",
        variant: "destructive",
      });
    }
  });
  
  // Update vehicle
  const updateMutation = useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!vehicle.id) throw new Error("ID do veículo não fornecido");
      
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          plate: vehicle.plate,
          type: vehicle.type,
          capacity: vehicle.capacity,
          supplier: vehicle.supplier
        })
        .eq('id', vehicle.id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Veículo atualizado",
        description: "O veículo foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o veículo.",
        variant: "destructive",
      });
    }
  });
  
  // Delete vehicle
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o veículo.",
        variant: "destructive",
      });
    }
  });

  return {
    vehicles: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
