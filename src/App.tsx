
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptDetailPage from "./pages/ReceiptDetailPage";
import ReportsPage from "./pages/ReportsPage";
import DatabasePage from "./pages/DatabasePage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import TransactionsPage from "./pages/TransactionsPage"; 
import MelhoriasPage from "./pages/MelhoriasPage";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster as SonnerToaster } from "sonner";

// Create the client as a constant rather than directly in the App component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 1000 * 30, // 30 seconds - improve performance
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SonnerToaster position="top-center" richColors />
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/receipts" element={<ReceiptsPage />} />
                <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
                <Route path="/transactions" element={<TransactionsPage />} /> 
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/database" element={<DatabasePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/melhorias" element={<MelhoriasPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
