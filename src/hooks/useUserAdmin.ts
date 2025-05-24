
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfAdmin = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (profile?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkIfAdmin();
  }, []);

  return { isAdmin, isLoading };
}
