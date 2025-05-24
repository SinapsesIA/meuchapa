
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Receipt } from "@/types";
import { extractStructuredDataFromImage } from "@/utils/imageProcessing";
import { useFileUpload } from "./use-file-upload";
import { checkApiKeys, saveReceiptToSupabase } from "@/utils/receipt-utils";
import { saveProcessedFile } from "@/utils/file-utils";

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing-ocr' | 'processing-ai' | 'completed' | 'error';
  currentFile?: string;
  error?: string;
}

export function useReceiptProcessor() {
  const [progress, setProgress] = useState(0);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle'
  });
  const { uploadFile, uploading } = useFileUpload();

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
    
    setProgress(10);
    setProcessingState({ status: 'uploading' });
    
    const processedResults: Receipt[] = [];
    const bucketName = 'receipt_images';
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(10 + Math.round((i / files.length) * 80));
        
        try {
          // Process the receipt with OCR
          const processedReceipt = await processReceiptWithOCR(file);
          
          // Upload file to storage
          setProcessingState({
            status: 'uploading',
            currentFile: file.name
          });
          
          console.log(`Uploading file ${file.name} to bucket ${bucketName}`);
          const imageUrl = await uploadFile(file, bucketName);
          
          if (imageUrl) {
            // Update the receipt object with the storage URL
            const updatedReceipt = {
              ...processedReceipt,
              imageUrl
            };
            
            // Save to Supabase
            setProcessingState({
              status: 'processing-ai',
              currentFile: 'Salvando no banco de dados...'
            });
            
            await saveReceiptToSupabase(updatedReceipt);
            
            // Save file info to processed_files table
            await saveProcessedFile(file.name, updatedReceipt.id);
            
            processedResults.push(updatedReceipt);
          }
        } catch (fileError) {
          // Error already handled in processReceiptWithOCR
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
      setProgress(0);
      setTimeout(() => {
        setProcessingState({ status: 'idle' });
      }, 3000);
    }
  };

  return {
    uploading,
    progress,
    processingState,
    processReceipts,
  };
}
