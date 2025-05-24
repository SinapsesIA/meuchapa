
import { Receipt } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Save receipt data to Supabase
 * @param receipt Receipt data to save
 * @returns True if save was successful
 */
export const saveReceiptToSupabase = async (receipt: Receipt): Promise<boolean> => {
  try {
    const { error } = await supabase.from('receipts').insert({
      id: receipt.id,
      image_url: receipt.imageUrl,
      ocr_text: receipt.ocrText,
      processed_at: receipt.processedAt.toISOString(),
      payment_status: receipt.paymentStatus,
      company_name: receipt.companyName,
      company_document: receipt.companyDocument,
      company_address: receipt.companyAddress,
      document_date: receipt.documentDate,
      receipt_number: receipt.receiptNumber,
      supplier_name: receipt.supplierName,
      supplier_document: receipt.supplierDocument,
      supplier_address: receipt.supplierAddress,
      service_type: receipt.serviceType,
      item_count: receipt.itemCount,
      unit: receipt.unit,
      total_weight: receipt.totalWeight,
      total_volume: receipt.totalVolume,
      unit_price: receipt.unitPrice,
      service_total: receipt.serviceTotal,
      additional_value: receipt.additionalValue,
      discount_value: receipt.discountValue,
      total_amount: receipt.totalAmount,
      return_amount: receipt.returnAmount,
      vehicle_plate: receipt.vehiclePlate,
      responsible: receipt.responsible,
      payment_method: receipt.paymentMethod,
      pix_key: receipt.pixKey,
      email: receipt.email,
      notes: receipt.notes,
      city_state: receipt.cityState
    });

    if (error) {
      console.error("Error saving receipt to Supabase:", error);
      throw new Error("Erro ao salvar recibo no banco de dados");
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveReceiptToSupabase:", error);
    throw error;
  }
};

/**
 * Update existing receipt in Supabase
 * @param receipt Updated receipt data
 * @returns True if update was successful
 */
export const updateReceiptInSupabase = async (receipt: Receipt): Promise<boolean> => {
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('receipts')
      .update({
        image_url: receipt.imageUrl,
        ocr_text: receipt.ocrText,
        payment_status: receipt.paymentStatus,
        company_name: receipt.companyName,
        company_document: receipt.companyDocument,
        company_address: receipt.companyAddress,
        document_date: receipt.documentDate,
        receipt_number: receipt.receiptNumber,
        supplier_name: receipt.supplierName,
        supplier_document: receipt.supplierDocument,
        supplier_address: receipt.supplierAddress,
        service_type: receipt.serviceType,
        item_count: receipt.itemCount,
        unit: receipt.unit,
        total_weight: receipt.totalWeight,
        total_volume: receipt.totalVolume,
        unit_price: receipt.unitPrice,
        service_total: receipt.serviceTotal,
        additional_value: receipt.additionalValue,
        discount_value: receipt.discountValue,
        total_amount: receipt.totalAmount,
        return_amount: receipt.returnAmount,
        vehicle_plate: receipt.vehiclePlate,
        responsible: receipt.responsible,
        payment_method: receipt.paymentMethod,
        pix_key: receipt.pixKey,
        email: receipt.email,
        notes: receipt.notes,
        city_state: receipt.cityState
      })
      .eq('id', receipt.id);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar recibo:", error);
    toast.error("Erro ao atualizar recibo");
    return false;
  }
};

/**
 * Check if API keys are configured
 * @returns True if API keys are configured
 */
export const checkApiKeys = async (): Promise<boolean> => {
  try {
    // Check database first
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('google_vision_key')
      .limit(1);
      
    if (!error && data && data.length > 0 && data[0].google_vision_key) {
      return true;
    }
    
    // If no keys in database, check localStorage
    const savedKeysJson = localStorage.getItem('api_keys');
    const savedKeys = savedKeysJson ? JSON.parse(savedKeysJson) : null;
    return !!savedKeys?.google_vision_key;
  } catch (e) {
    console.error("Error checking API keys:", e);
    return false;
  }
};
