
import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If already logged in, navigate to dashboard
    if (!loading && user) {
      navigate("/dashboard");
    }
    
    // Show message about direct access
    toast.info("Acesso direto ativado", {
      description: "Você pode acessar a aplicação imediatamente após o cadastro, sem necessidade de confirmar o email."
    });
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Don't render login form if already logged in - will redirect via useEffect
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center space-y-6">
          <img 
            src="/lovable-uploads/3c0acfe2-71b4-4ab6-bf2a-ef3db438e982.png" 
            alt="Meu Chapa Logo" 
            className="mx-auto h-24 w-auto"
          />
          <p className="text-gray-600">
            Sistema de gerenciamento de recibos com OCR
          </p>
        </div>
        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
