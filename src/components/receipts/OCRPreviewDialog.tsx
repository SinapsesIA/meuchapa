
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Receipt } from "@/types";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { extractStructuredDataFromImage } from "@/utils/imageProcessing";
import { supabase } from "@/integrations/supabase/client";
import { OCRTextDisplay } from "./dialog/OCRTextDisplay";
import { ExtractedDataDisplay } from "./dialog/ExtractedDataDisplay";
import { EnhanceButton } from "./dialog/EnhanceButton";

interface OCRPreviewDialogProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedReceipt: Receipt) => void;
}

export function OCRPreviewDialog({ receipt, isOpen, onClose, onUpdate }: OCRPreviewDialogProps) {
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiEnhancedReceipt, setAiEnhancedReceipt] = useState<Receipt | null>(null);
  
  if (!receipt) return null;

  const displayedReceipt = aiEnhancedReceipt || receipt;

  const enhanceWithAI = async () => {
    if (!receipt) return;
    
    const { data: apiKeys } = await supabase
      .from('user_api_keys')
      .select('google_vision_key')
      .single();
    
    if (!apiKeys?.google_vision_key) {
      toast.error("Configure a chave de API do Google Vision nas configurações antes de processar com IA avançada.");
      return;
    }
    
    setIsProcessingAI(true);
    
    try {
      const enhancedData = await extractStructuredDataFromImage(receipt.imageUrl);
      
      const enhancedReceiptData: Receipt = {
        ...receipt,
        ocrText: enhancedData.ocrText,
        companyName: enhancedData.companyName,
        companyDocument: enhancedData.companyDocument,
        companyAddress: enhancedData.companyAddress,
        totalAmount: enhancedData.totalAmount,
        documentDate: enhancedData.documentDate,
        supplierDocument: enhancedData.supplierDocument,
        serviceType: enhancedData.serviceType,
        vehiclePlate: enhancedData.vehiclePlate,
        paymentMethod: enhancedData.paymentMethod,
      };
      
      setAiEnhancedReceipt(enhancedReceiptData);
      
      if (onUpdate) {
        onUpdate(enhancedReceiptData);
      }
      
      toast.success("Dados extraídos com IA avançada com sucesso!");
    } catch (error) {
      console.error('Erro ao processar com IA:', error);
      toast.error("Erro ao processar imagem com IA avançada");
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações do OCR - {displayedReceipt.receiptNumber}
          </DialogTitle>
          <DialogDescription>
            Visualize os dados extraídos do recibo através de OCR avançado
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end mb-2">
          <EnhanceButton 
            onClick={enhanceWithAI}
            isProcessing={isProcessingAI}
            isEnhanced={!!aiEnhancedReceipt}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <OCRTextDisplay ocrText={displayedReceipt.ocrText} />
          <ExtractedDataDisplay 
            receipt={displayedReceipt} 
            isAIEnhanced={!!aiEnhancedReceipt}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
