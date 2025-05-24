
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/types";

export function useServiceData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch services
  const query = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      return data as Service[];
    }
  });
  
  // Add service
  const addMutation = useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      console.log("Adding service:", service);
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: service.name,
          description: service.description,
          price: service.price
        }])
        .select();
      
      if (error) {
        console.error("Error adding service:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço adicionado",
        description: "O serviço foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o serviço.",
        variant: "destructive",
      });
    }
  });
  
  // Update service
  const updateMutation = useMutation({
    mutationFn: async (service: Service) => {
      if (!service.id) throw new Error("ID do serviço não fornecido");
      
      console.log("Updating service:", service);
      const { data, error } = await supabase
        .from('services')
        .update({
          name: service.name,
          description: service.description,
          price: service.price
        })
        .eq('id', service.id)
        .select();
      
      if (error) {
        console.error("Error updating service:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o serviço.",
        variant: "destructive",
      });
    }
  });
  
  // Delete service
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting service with ID:", id);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting service:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o serviço.",
        variant: "destructive",
      });
    }
  });

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
