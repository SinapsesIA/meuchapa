
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Define types for our RPC function returns
interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
}

// TypeScript utility to allow custom RPC functions
declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    rpc<T = any>(
      fn: string,
      params?: object,
      options?: object
    ): PostgrestSingleResponse<T>;
  }
}

export function useAccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Update profile information
  const updateProfile = useCallback(async ({ name, email, company }: { 
    name: string; 
    email: string;
    company?: string;
  }) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você não está autenticado."
        });
        return false;
      }
      
      console.log("Updating profile with values:", { 
        user_id: user.id,
        full_name_param: name,
        email_param: email, 
        company_param: company 
      });
      
      // Use direct SQL query with RPC to bypass RLS recursion
      const { data, error: profileError } = await supabase.rpc(
        'update_user_profile',
        {
          user_id: user.id,
          full_name_param: name,
          email_param: email,
          company_param: company || null
        }
      );
      
      console.log("Profile update response:", { data, error: profileError });
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }
      
      // Update user's email in auth if it changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email
        });
        
        if (emailError) {
          console.error("Email update error:", emailError);
          throw emailError;
        }
      }
      
      toast({
        title: "Sucesso",
        description: "Informações atualizadas com sucesso!"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Update password
  const updatePassword = useCallback(async ({ 
    currentPassword, 
    newPassword 
  }: { 
    currentPassword: string; 
    newPassword: string;
  }) => {
    try {
      setIsLoading(true);
      
      // First authenticate with current password to verify it's correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      });
      
      if (signInError) {
        console.error("Authentication error:", signInError);
        throw new Error("Senha atual incorreta");
      }
      
      // Then update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Senha atualizada com sucesso!"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Get user profile data
  const getUserProfile = useCallback(async () => {
    try {
      if (!user) {
        return null;
      }
      
      console.log("Getting user profile for ID:", user.id);
      
      // Use direct SQL query with RPC to bypass RLS recursion
      const { data, error } = await supabase.rpc<UserProfile[]>(
        'get_user_profile_by_id',
        {
          lookup_id: user.id
        }
      );
      
      console.log("Profile data received:", data);
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      if (!data || data.length === 0) return {
        name: user.user_metadata?.name || "",
        email: user.email || "",
        company: ""
      };
      
      // Ajuste aqui para usar o primeiro item da matriz de resultados
      const profile = data[0];
      
      const profileData = {
        name: profile.full_name || "",
        email: user.email || "",
        company: profile.company || ""
      };
      
      console.log("Loaded profile data:", profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        name: user?.user_metadata?.name || "",
        email: user?.email || "",
        company: ""
      };
    }
  }, [user]);

  return {
    isLoading,
    updateProfile,
    updatePassword,
    getUserProfile
  };
}
