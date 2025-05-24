
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Store user in localStorage for compatibility
          if (session?.user) {
            localStorage.setItem("user", JSON.stringify({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Usuário",
              email: session.user.email,
              role: "user"
            }));
          } else {
            localStorage.removeItem("user");
          }
        }
      }
    );
    
    // Check for existing session
    async function getInitialSession() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found in session:', session.user);
            localStorage.setItem("user", JSON.stringify({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Usuário",
              email: session.user.email,
              role: "user"
            }));
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    getInitialSession();
    
    return () => {
      subscription?.unsubscribe();
      mounted = false;
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      // If successful, update the user state immediately
      if (data?.user && !error) {
        setUser(data.user);
        setSession(data.session);
        
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || "Usuário",
          email: data.user.email,
          role: "user"
        }));
        
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      }
      
      return { error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // No email verification required
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
            role: 'user'
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      // If signup is successful and we have a user
      if (data?.user && !error) {
        // Auto-login after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInData?.user && !signInError) {
          setUser(signInData.user);
          setSession(signInData.session);
          
          localStorage.setItem("user", JSON.stringify({
            id: signInData.user.id,
            name: signInData.user.user_metadata?.name || signInData.user.email?.split('@')[0] || "Usuário",
            email: signInData.user.email,
            role: "user"
          }));
          
          toast.success("Conta criada e login realizado com sucesso!");
          navigate("/dashboard");
        }
        
        return { error: signInError };
      }
      
      return { error };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem("user");
      setUser(null);
      setSession(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
