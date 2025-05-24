
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Receipt } from "@/types";
import { extractStructuredDataFromImage } from "@/utils/imageProcessing";
import { supabase } from "@/integrations/supabase/client";

interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing-ocr' | 'processing-ai' | 'completed' | 'error';
  currentFile?: string;
  error?: string;
}

export function useReceiptProcessing() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle'
  });

  const processReceiptWithOCR = async (file: File): Promise<Receipt> => {
    const baseReceipt: Receipt = {
      id: uuidv4(),
      imageUrl: URL.createObjectURL(file),
      ocrText: "",
      processedAt: new Date(),
      paymentStatus: "pending",
      receiptNumber: `REC-${1000 + Math.floor(Math.random() * 9000)}`,
    };

    try {
      setProcessingState({
        status: 'processing-ocr',
        currentFile: file.name
      });

      const imageUrl = URL.createObjectURL(file);
      const extractedData = await extractStructuredDataFromImage(imageUrl);
    
      return {
        ...baseReceipt,
        ocrText: extractedData.ocrText || "",
        companyName: extractedData.companyName,
        companyDocument: extractedData.companyDocument,
        companyAddress: extractedData.companyAddress,
        supplierName: extractedData.supplierName,
        totalAmount: extractedData.totalAmount,
        documentDate: extractedData.documentDate,
        supplierDocument: extractedData.supplierDocument,
        serviceType: extractedData.serviceType,
        vehiclePlate: extractedData.vehiclePlate,
        paymentMethod: extractedData.paymentMethod,
      };
    } catch (error) {
      let errorMessage = `Erro ao processar recibo ${file.name}`;
      
      if (error instanceof Error) {
        if (error.message.includes("faturamento")) {
          errorMessage = `Erro de Faturamento: O Google Cloud Vision API requer faturamento habilitado. Configure o faturamento do seu projeto no Google Cloud Console.`;
          toast.error(errorMessage, {
            duration: 8000,
            action: {
              label: "Saiba Mais",
              onClick: () => window.open("https://cloud.google.com/billing/docs/how-to/modify-project", "_blank")
            }
          });
        } else {
          errorMessage = `Erro ao processar recibo ${file.name}: ${error.message}`;
          toast.error(errorMessage);
        }
      }
      
      console.error(errorMessage);
      throw error;
    }
  };

  const checkApiKeys = async (): Promise<boolean> => {
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

  // Function to save receipt to Supabase
  const saveReceiptToSupabase = async (receipt: Receipt): Promise<boolean> => {
    try {
      setProcessingState({
        status: 'processing-ai',
        currentFile: 'Salvando no banco de dados...'
      });
      
      // Convert receipt object to match Supabase table structure
      const supabaseReceipt = {
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
      };
      
      const { error } = await supabase
        .from('receipts')
        .upsert(supabaseReceipt, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error("Error saving receipt to Supabase:", error);
        toast.error(`Erro ao salvar recibo no banco de dados: ${error.message}`);
        return false;
      }
      
      console.log("Receipt saved to Supabase successfully:", receipt.id);
      return true;
    } catch (error) {
      console.error("Exception saving receipt to Supabase:", error);
      toast.error("Erro ao salvar recibo no banco de dados");
      return false;
    }
  };

  const processReceipts = async (files: File[]) => {
    if (!files.length) return [];
    
    // Check if API key is configured
    const hasApiKeys = await checkApiKeys();
    
    if (!hasApiKeys) {
      toast.error("Configure a chave da API do Google Vision nas configurações antes de processar os recibos.", {
        duration: 5000,
        action: {
          label: "Ir para Configurações",
          onClick: () => window.location.href = '/settings'
        }
      });
      return [];
    }
    
    setUploading(true);
    setProgress(10);
    setProcessingState({ status: 'uploading' });
    
    const processedResults: Receipt[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(10 + Math.round((i / files.length) * 80));
        
        try {
          const processedReceipt = await processReceiptWithOCR(file);
          processedResults.push(processedReceipt);
          
          // Save the receipt to Supabase
          await saveReceiptToSupabase(processedReceipt);
        } catch (fileError) {
          // Erro já tratado no processReceiptWithOCR
          console.error("Falha no processamento de arquivo individual:", fileError);
        }
      }
      
      setProgress(100);
      setProcessingState({ status: 'completed' });
      
      if (processedResults.length > 0) {
        toast.success(`${processedResults.length} recibos processados com sucesso!`);
      }
      
      return processedResults;
    } catch (error) {
      const errorMessage = "Erro ao processar recibos.";
      console.error("Erro ao processar recibos:", error);
      setProcessingState({
        status: 'error',
        error: errorMessage
      });
      toast.error(errorMessage);
      return [];
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    processingState,
    processReceipts,
  };
}
