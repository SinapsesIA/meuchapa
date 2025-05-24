import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Melhoria, MelhoriaComentario, MelhoriaStatusType } from "@/types/melhorias";
import { toast } from "sonner";
import { setupStorageBuckets } from "@/utils/supabase-storage-setup";

export function useMelhoriaMutations() {
  const queryClient = useQueryClient();

  // Ensure storage buckets are set up
  const initializeBuckets = async () => {
    await setupStorageBuckets();
  };

  // Helper function to upload image to storage
  const uploadImageToStorage = async (imageFile: File | null | string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      // If the image is already a URL or a base64 string, return it
      if (typeof imageFile === 'string') {
        if (imageFile.startsWith('http') || imageFile.startsWith('data:image/')) {
          return imageFile;
        }
      }

      // Initialize buckets
      await initializeBuckets();
      
      // Generate a unique filename for the image file
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      const filePath = `melhorias/${fileName}`;
      
      let fileToUpload: File | Blob;
      
      // Convert base64 to blob if needed
      if (typeof imageFile === 'string' && imageFile.startsWith('data:image/')) {
        const response = await fetch(imageFile);
        fileToUpload = await response.blob();
      } else if (imageFile instanceof File) {
        fileToUpload = imageFile;
      } else {
        throw new Error("Invalid image format");
      }
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('melhorias')
        .upload(filePath, fileToUpload);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('melhorias')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const createMelhoriaMutation = useMutation({
    mutationFn: async (novaMelhoria: Omit<Melhoria, "id" | "data_solicitacao" | "data_atualizacao" | "status"> & {
      imagemFile?: File | null;
      anexoFile?: File | null;
    }) => {
      try {
        // Extract files to upload
        const { imagemFile, anexoFile, ...melhoriaData } = novaMelhoria;

        // Upload image if provided
        let imagem_url = null;
        if (imagemFile) {
          imagem_url = await uploadImageToStorage(imagemFile);
        } else if (novaMelhoria.imagem_url) {
          // Keep existing URL if no new file
          imagem_url = novaMelhoria.imagem_url;
        }
        
        // Upload anexo if provided
        let anexo_url = null;
        if (anexoFile) {
          // Generate a unique filename
          const fileExt = anexoFile.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `melhorias/${fileName}`;
          
          // Upload the file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('melhorias')
            .upload(filePath, anexoFile);
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data } = supabase.storage
            .from('melhorias')
            .getPublicUrl(filePath);
          
          anexo_url = data.publicUrl;
        } else if (novaMelhoria.anexo_url) {
          // Keep existing URL if no new file
          anexo_url = novaMelhoria.anexo_url;
        }

        // Ensure status is set to 'Pendente'
        const melhoriaToCreate = {
          ...melhoriaData,
          imagem_url,
          anexo_url,
          status: 'Pendente' as MelhoriaStatusType,
          data_solicitacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
          // Remove usuario_id completely to make it null in the database
          usuario_id: null
        };
        
        const { data, error } = await supabase
          .from("melhorias_ajustes")
          .insert(melhoriaToCreate)
          .select("id")
          .single();
          
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error creating melhoria:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["melhorias"] });
      toast.success("Solicitação criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar solicitação:", error);
      toast.error("Erro ao criar solicitação");
    },
  });

  const updateMelhoriaMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates,
      imagemFile,
      anexoFile 
    }: { 
      id: string; 
      updates: Partial<Melhoria>;
      imagemFile?: File | null;
      anexoFile?: File | null;
    }) => {
      try {
        // Prepare updates for Supabase
        const supabaseUpdates: Record<string, any> = { ...updates };
        
        // Handle image upload if provided
        if (imagemFile) {
          const imagem_url = await uploadImageToStorage(imagemFile);
          supabaseUpdates.imagem_url = imagem_url;
        }
        
        // Handle anexo upload if provided
        if (anexoFile) {
          // Generate a unique filename
          const fileExt = anexoFile.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `melhorias/${fileName}`;
          
          // Upload the file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('melhorias')
            .upload(filePath, anexoFile);
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data } = supabase.storage
            .from('melhorias')
            .getPublicUrl(filePath);
          
          supabaseUpdates.anexo_url = data.publicUrl;
        }
        
        // Convert Date objects to ISO strings for Supabase
        if (updates.data_solicitacao instanceof Date) {
          supabaseUpdates.data_solicitacao = updates.data_solicitacao.toISOString();
        }
        
        if (updates.data_atualizacao instanceof Date) {
          supabaseUpdates.data_atualizacao = updates.data_atualizacao.toISOString();
        }
        
        // Always update the data_atualizacao field
        supabaseUpdates.data_atualizacao = new Date().toISOString();

        const { data, error } = await supabase
          .from("melhorias_ajustes")
          .update(supabaseUpdates)
          .eq("id", id);
          
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error updating melhoria:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["melhorias"] });
      queryClient.invalidateQueries({ queryKey: ["melhoria", variables.id] });
      toast.success("Solicitação atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar solicitação:", error);
      toast.error("Erro ao atualizar solicitação");
    },
  });

  const createComentarioMutation = useMutation({
    mutationFn: async (novoComentario: Omit<MelhoriaComentario, "id" | "data_criacao">) => {
      const { data, error } = await supabase
        .from("melhorias_comentarios")
        .insert(novoComentario)
        .select();
        
      if (error) {
        console.error("Error creating comentario:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comentarios", variables.melhoria_id] });
      // Also update the melhoria to reflect the updated date
      updateMelhoriaMutation.mutate({ 
        id: variables.melhoria_id, 
        updates: { data_atualizacao: new Date() } 
      });
      toast.success("Comentário adicionado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao adicionar comentário");
    },
  });

  return {
    createMelhoria: createMelhoriaMutation.mutate,
    updateMelhoria: updateMelhoriaMutation.mutate,
    createComentario: createComentarioMutation.mutate,
  };
}
