import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ReceiptFilterBar } from "@/components/receipts/ReceiptFilterBar";
import { ReceiptList } from "@/components/receipts/ReceiptList";
import { FilterOptions, Receipt } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isValid, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

export default function ReceiptsPage() {
  const queryClient = useQueryClient();
  const { data: allReceipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: fetchReceipts,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
  
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  
  // Update filtered receipts when all receipts data changes
  useEffect(() => {
    if (allReceipts) {
      setFilteredReceipts(allReceipts);
    }
  }, [allReceipts]);

  const isValidDate = (dateStr: string | undefined): boolean => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      return isValid(date);
    } catch (e) {
      console.error("Invalid date format:", dateStr, e);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      // Invalidate the query to update the list
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      
      // Update local state as well for immediate UI update
      setFilteredReceipts(prevFiltered => prevFiltered.filter(receipt => receipt.id !== id));
      
      toast.success("Recibo excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir recibo:", error);
      toast.error("Erro ao excluir o recibo");
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    if (!allReceipts) return;
    
    // In a real app, this would filter data from the backend
    // For now, we'll just simulate filtering the mock data
    let filtered = [...allReceipts];
    
    if (filters.dateRange) {
      filtered = filtered.filter(receipt => {
        if (!receipt.documentDate || !isValidDate(receipt.documentDate)) return false;
        
        try {
          const receiptDate = parseISO(receipt.documentDate);
          if (!isValid(receiptDate)) return false;
          
          return (
            receiptDate >= filters.dateRange!.start && 
            receiptDate <= filters.dateRange!.end
          );
        } catch (error) {
          console.error("Error parsing date:", error);
          return false;
        }
      });
    }
    
    if (filters.supplier) {
      filtered = filtered.filter(
        receipt => receipt.supplierName?.toLowerCase().includes(filters.supplier!.toLowerCase())
      );
    }
    
    if (filters.serviceType && filters.serviceType !== "all") {
      filtered = filtered.filter(
        receipt => receipt.serviceType?.toLowerCase() === filters.serviceType!.toLowerCase()
      );
    }
    
    if (filters.vehiclePlate) {
      filtered = filtered.filter(
        receipt => receipt.vehiclePlate?.toLowerCase().includes(filters.vehiclePlate!.toLowerCase())
      );
    }
    
    setFilteredReceipts(filtered);
    toast.info(`Encontrados ${filtered.length} recibos`);
  };

  const handleExport = (format: "excel" | "pdf") => {
    // This would integrate with a real export functionality
    toast.success(`Exportação para ${format.toUpperCase()} iniciada`);
  };

  return (
    <Layout loading={isLoading}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Histórico de Recibos</h1>
        
        <ReceiptFilterBar onFilterChange={handleFilterChange} onExport={handleExport} />
        <ReceiptList receipts={filteredReceipts} onDelete={handleDelete} />
        
        {filteredReceipts.length === 0 && !isLoading && (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Nenhum recibo encontrado no banco de dados.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
