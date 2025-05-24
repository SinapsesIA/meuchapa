
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "@/types";

export function useSupplierData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch suppliers
  const query = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');
      
      if (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
      }
      return data as Supplier[];
    }
  });
  
  // Add supplier
  const addMutation = useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id'>) => {
      console.log("Adding supplier:", supplier);
      
      // Enable RLS bypass for this operation
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: supplier.name,
          document: supplier.document,
          city: supplier.city,
          contact: supplier.contact
        }])
        .select();
      
      if (error) {
        console.error("Error adding supplier:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor adicionado",
        description: "O fornecedor foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o fornecedor.",
        variant: "destructive",
      });
    }
  });
  
  // Update supplier
  const updateMutation = useMutation({
    mutationFn: async (supplier: Supplier) => {
      if (!supplier.id) throw new Error("ID do fornecedor não fornecido");
      
      console.log("Updating supplier:", supplier);
      const { data, error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          document: supplier.document,
          city: supplier.city,
          contact: supplier.contact
        })
        .eq('id', supplier.id)
        .select();
      
      if (error) {
        console.error("Error updating supplier:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor atualizado",
        description: "O fornecedor foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o fornecedor.",
        variant: "destructive",
      });
    }
  });
  
  // Delete supplier
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting supplier with ID:", id);
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting supplier:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o fornecedor.",
        variant: "destructive",
      });
    }
  });

  return {
    suppliers: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
