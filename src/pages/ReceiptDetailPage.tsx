
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ReceiptDetail } from "@/components/receipts/ReceiptDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Receipt } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchReceipt(id: string) {
  if (!id) {
    throw new Error("ID do recibo não fornecido");
  }
  
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    throw new Error("Recibo não encontrado");
  }
  
  // Transform data to match Receipt type
  const receiptData: Receipt = {
    id: data.id,
    imageUrl: data.image_url || "",
    ocrText: data.ocr_text || "",
    processedAt: new Date(data.processed_at),
    paymentStatus: data.payment_status as "pending" | "paid" | "contested",
    companyName: data.company_name,
    companyDocument: data.company_document,
    companyAddress: data.company_address,
    documentDate: data.document_date,
    receiptNumber: data.receipt_number,
    supplierName: data.supplier_name,
    supplierDocument: data.supplier_document,
    supplierAddress: data.supplier_address,
    serviceType: data.service_type,
    itemCount: data.item_count,
    unit: data.unit,
    totalWeight: data.total_weight,
    totalVolume: data.total_volume,
    unitPrice: data.unit_price,
    serviceTotal: data.service_total,
    additionalValue: data.additional_value,
    discountValue: data.discount_value,
    totalAmount: data.total_amount,
    returnAmount: data.return_amount,
    vehiclePlate: data.vehicle_plate,
    responsible: data.responsible,
    paymentMethod: data.payment_method,
    pixKey: data.pix_key,
    email: data.email,
    notes: data.notes,
    cityState: data.city_state
  };
  
  return receiptData;
}

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: receipt, isLoading, error } = useQuery({
    queryKey: ['receipt', id],
    queryFn: () => fetchReceipt(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const handleGoBack = () => {
    // Invalidate the receipts query to force a refresh when navigating back
    queryClient.invalidateQueries({ queryKey: ['receipts'] });
    navigate("/receipts");
  };

  const handleSave = async (updatedReceipt: Receipt) => {
    try {
      // Convert Receipt object to match Supabase table structure
      const supabaseData = {
        image_url: updatedReceipt.imageUrl,
        ocr_text: updatedReceipt.ocrText,
        payment_status: updatedReceipt.paymentStatus,
        company_name: updatedReceipt.companyName,
        company_document: updatedReceipt.companyDocument,
        company_address: updatedReceipt.companyAddress,
        document_date: updatedReceipt.documentDate,
        receipt_number: updatedReceipt.receiptNumber,
        supplier_name: updatedReceipt.supplierName,
        supplier_document: updatedReceipt.supplierDocument,
        supplier_address: updatedReceipt.supplierAddress,
        service_type: updatedReceipt.serviceType,
        item_count: updatedReceipt.itemCount,
        unit: updatedReceipt.unit,
        total_weight: updatedReceipt.totalWeight,
        total_volume: updatedReceipt.totalVolume,
        unit_price: updatedReceipt.unitPrice,
        service_total: updatedReceipt.serviceTotal,
        additional_value: updatedReceipt.additionalValue,
        discount_value: updatedReceipt.discountValue,
        total_amount: updatedReceipt.totalAmount,
        return_amount: updatedReceipt.returnAmount,
        vehicle_plate: updatedReceipt.vehiclePlate,
        responsible: updatedReceipt.responsible,
        payment_method: updatedReceipt.paymentMethod,
        pix_key: updatedReceipt.pixKey,
        email: updatedReceipt.email,
        notes: updatedReceipt.notes,
        city_state: updatedReceipt.cityState
      };
      
      // Update receipt in Supabase
      const { error } = await supabase
        .from('receipts')
        .update(supabaseData)
        .eq('id', updatedReceipt.id);
      
      if (error) {
        throw error;
      }
      
      // Invalidate the queries to force a refresh of the data
      queryClient.invalidateQueries({ queryKey: ['receipt', id] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] }); // Also invalidate the list query
      
      toast.success("Recibo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar recibo:", error);
      toast.error("Erro ao salvar as alterações");
    }
  };

  return (
    <Layout loading={isLoading}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Recibo</h1>
        </div>

        {error ? (
          <div className="text-center py-12 bg-muted rounded-md">
            <p className="text-xl font-medium">
              {error instanceof Error ? error.message : "Erro ao carregar recibo"}
            </p>
            <Button 
              className="mt-4" 
              onClick={handleGoBack}
            >
              Voltar para a lista
            </Button>
          </div>
        ) : receipt ? (
          <ReceiptDetail receipt={receipt} onSave={handleSave} />
        ) : null}
      </div>
    </Layout>
  );
}
