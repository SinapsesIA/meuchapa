
import React, { ReactNode, useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FloatingAjusteButton } from '@/components/ajuste/FloatingAjusteButton';
import { useAuth } from '@/hooks/use-auth';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  loading?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  loading = false
}) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // If auth is required and no user is present, redirect to login
    if (requireAuth && !authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, requireAuth, navigate]);

  // Show loading state while auth is being checked
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando...</span>
      </div>
    );
  }

  // If auth is required and still no user, don't render anything (will redirect)
  if (requireAuth && !user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
      
      {/* Adiciona o botão flutuante em todas as páginas */}
      <FloatingAjusteButton />
    </div>
  );
};
