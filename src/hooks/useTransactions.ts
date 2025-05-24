
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isValid, parseISO } from "date-fns";

async function fetchReceipts() {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("processed_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Transform Supabase data to match Receipt type
  const transformedData: Receipt[] = data.map(item => ({
    id: item.id,
    imageUrl: item.image_url || "",
    ocrText: item.ocr_text || "",
    processedAt: new Date(item.processed_at),
    paymentStatus: item.payment_status as "pending" | "paid" | "contested",
    companyName: item.company_name,
    companyDocument: item.company_document,
    companyAddress: item.company_address,
    documentDate: item.document_date,
    receiptNumber: item.receipt_number,
    supplierName: item.supplier_name,
    supplierDocument: item.supplier_document,
    supplierAddress: item.supplier_address,
    serviceType: item.service_type,
    itemCount: item.item_count,
    unit: item.unit,
    totalWeight: item.total_weight,
    totalVolume: item.total_volume,
    unitPrice: item.unit_price,
    serviceTotal: item.service_total,
    additionalValue: item.additional_value,
    discountValue: item.discount_value,
    totalAmount: item.total_amount,
    returnAmount: item.return_amount,
    vehiclePlate: item.vehicle_plate,
    responsible: item.responsible,
    paymentMethod: item.payment_method,
    pixKey: item.pix_key,
    email: item.email,
    notes: item.notes,
    cityState: item.city_state
  }));

  return transformedData;
}

export function useTransactions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Simple auth check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: fetchReceipts,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  useEffect(() => {
    // Filter receipts based on search term
    if (!receipts) return;
    
    if (searchTerm.trim() === "") {
      setFilteredReceipts(receipts);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredReceipts(
        receipts.filter((receipt) => {
          return (
            receipt.companyName?.toLowerCase().includes(lowercaseSearch) ||
            receipt.supplierName?.toLowerCase().includes(lowercaseSearch) ||
            receipt.receiptNumber?.toLowerCase().includes(lowercaseSearch) ||
            receipt.vehiclePlate?.toLowerCase().includes(lowercaseSearch) ||
            receipt.serviceType?.toLowerCase().includes(lowercaseSearch)
          );
        })
      );
    }
  }, [searchTerm, receipts]);

  const handleViewReceipt = (id: string) => {
    navigate(`/receipts/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', deleteConfirmId);

      if (error) {
        throw error;
      }

      // Invalidate the query to update the list
      queryClient.invalidateQueries({ queryKey: ['receipts'] });

      // Remove from state for immediate UI update
      setFilteredReceipts(prev => prev.filter(receipt => receipt.id !== deleteConfirmId));

      toast({
        title: "Recibo excluído",
        description: "O recibo foi excluído com sucesso do banco de dados.",
      });

    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast({
        title: "Erro ao excluir recibo",
        description: "Não foi possível excluir o recibo do banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return "N/A";
    
    // Convert to Date object if it's a string
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return {
    filteredReceipts,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteConfirmId,
    setDeleteConfirmId,
    isDeleting,
    handleViewReceipt,
    handleDeleteConfirm,
    formatDate,
    formatCurrency
  };
}
