import { supabase } from "@/integrations/supabase/client";
import { analyzeReceiptWithGPT } from "./gptProcessing";

interface ImageToTextResult {
  text: string;
}

interface ExtractedData {
  ocrText: string;
  companyName?: string;
  companyDocument?: string;
  companyAddress?: string;
  documentDate?: string;
  receiptNumber?: string;
  supplierName?: string;
  supplierDocument?: string;
  supplierAddress?: string;
  serviceType?: string;
  itemCount?: number;
  unit?: string;
  totalWeight?: number;
  totalVolume?: number;
  unitPrice?: number;
  serviceTotal?: number;
  additionalValue?: number;
  discountValue?: number;
  totalAmount?: number;
  returnAmount?: number;
  vehiclePlate?: string;
  responsible?: string;
  paymentMethod?: string;
  pixKey?: string;
  email?: string;
  notes?: string;
  cityState?: string;
}

// Função para buscar a chave da API do Google Vision das configurações
const getGoogleVisionKey = async (): Promise<string> => {
  const { data: apiKeys, error } = await supabase
    .from('user_api_keys')
    .select('google_vision_key')
    .single();

  if (error || !apiKeys?.google_vision_key) {
    throw new Error('Chave da API do Google Vision não configurada');
  }

  return apiKeys.google_vision_key;
};

// Função para converter imagem em base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Função para verificar o status do faturamento do Google Cloud
const checkBillingError = (errorData: any): boolean => {
  if (errorData?.error?.details) {
    const billingDisabledDetail = errorData.error.details.find(
      (detail: any) => detail["@type"]?.includes("ErrorInfo") && detail.reason === "BILLING_DISABLED"
    );
    return !!billingDisabledDetail;
  }
  return false;
};

export const extractTextFromImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log('Iniciando processamento de OCR com Google Vision...');
    
    // Buscar a chave da API
    const googleVisionKey = await getGoogleVisionKey();
    
    // Converter a imagem para base64
    const base64Image = await getBase64FromUrl(imageUrl);
    
    // Chamar a API do Google Cloud Vision com a chave das configurações
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleVisionKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image
          },
          features: [{
            type: 'TEXT_DETECTION'
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resposta de erro da API Google Vision:', errorData);
      
      if (response.status === 403) {
        if (checkBillingError(errorData)) {
          throw new Error("Google Cloud Vision API requer faturamento habilitado. Por favor, configure o faturamento do projeto no Google Cloud Console.");
        } else {
          throw new Error(`Erro de permissão na API do Google Vision: ${response.status}. Verifique a validade da chave API.`);
        }
      }
      
      throw new Error(`Erro na API do Google Vision: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const extractedText = data.responses[0]?.textAnnotations[0]?.description || '';
    
    if (!extractedText) {
      throw new Error('Nenhum texto encontrado na imagem');
    }
    
    return extractedText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Erro desconhecido ao processar a imagem: ${error}`);
    }
  }
};

export const extractStructuredDataFromImage = async (imageUrl: string): Promise<ExtractedData> => {
  try {
    const extractedText = await extractTextFromImage(imageUrl);
    
    if (!extractedText || extractedText.trim() === "") {
      throw new Error("Não foi possível extrair texto da imagem");
    }

    console.log('Texto extraído com sucesso, iniciando análise com GPT...');
    
    let gptAnalysis;
    try {
      gptAnalysis = await analyzeReceiptWithGPT(extractedText);
      console.log('Análise GPT concluída:', gptAnalysis);
    } catch (gptError) {
      console.error('Erro na análise GPT:', gptError);
      gptAnalysis = {};
    }

    return {
      ocrText: extractedText,
      ...gptAnalysis
    };
  } catch (error) {
    console.error('Erro ao extrair dados da imagem:', error);
    throw error;
  }
};
