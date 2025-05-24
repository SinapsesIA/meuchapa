
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Receipt } from "@/types";

export function useReportData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simple auth check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Load receipts data from Supabase
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
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

      setReceipts(transformedData);
      setFilteredReceipts(transformedData);
      return transformedData;
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast({
        title: "Erro ao carregar recibos",
        description: "Não foi possível carregar os dados dos recibos do banco de dados.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    receipts,
    filteredReceipts,
    setFilteredReceipts,
    loading
  };
}
