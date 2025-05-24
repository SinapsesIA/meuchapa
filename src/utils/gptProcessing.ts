import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GptAnalysisResult {
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

// Função para buscar a chave da API do OpenAI das configurações
const getOpenAIKey = async (): Promise<string> => {
  const { data: apiKeys, error } = await supabase
    .from('user_api_keys')
    .select('openai_key')
    .single();

  if (error || !apiKeys?.openai_key) {
    throw new Error('Chave da API do OpenAI não configurada');
  }

  return apiKeys.openai_key;
};

export const analyzeReceiptWithGPT = async (ocrText: string): Promise<GptAnalysisResult> => {
  try {
    // Buscar a chave da API do OpenAI
    const openAIKey = await getOpenAIKey();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em extrair informações de recibos brasileiros.
            
            IMPORTANTE INSTRUÇÕES DE FORMATAÇÃO DE NÚMEROS:
            - TODOS os valores numéricos DEVEM ser convertidos para o formato numérico brasileiro:
              * Exemplo: "1.234,56" deve ser convertido para 1234.56
              * Use o ponto como separador de milhar e a vírgula como separador decimal
              * Remova TODOS os separadores de milhar antes de converter
            - Para valores monetários, descarte o símbolo de R$ antes da conversão
            - Exemplos de conversão:
              * "R$ 1.234,56" → 1234.56
              * "5.678,90" → 5678.90
              * "123,45" → 123.45
            - Se o valor estiver em um formato diferente, faça a conversão corretamente

            DEMAIS INSTRUÇÕES ANTERIORES MANTIDAS...
            
            Analise o texto do recibo com MUITA ATENÇÃO e extraia as seguintes informações em formato JSON. Use EXATAMENTE os nomes de campos abaixo:
            
            DADOS DA EMPRESA EMITENTE (empresa que está cobrando o serviço):
            - companyName: nome da empresa emitente (apenas o nome, sem CNPJ ou outros dados)
            - companyDocument: CNPJ da empresa emitente (apenas o número, sem o texto "CNPJ")
            - companyAddress: endereço completo da empresa emitente
            
            INFORMAÇÕES DO DOCUMENTO:
            - documentDate: data do documento (formato YYYY-MM-DD)
            - receiptNumber: número do recibo/nota fiscal/lançamento/bônus (apenas o número)
            
            DADOS DO FORNECEDOR/CLIENTE (empresa ou pessoa que está recebendo o serviço):
            - supplierName: nome do fornecedor/cliente/contratado (apenas o nome, sem CNPJ ou outros dados)
            - supplierDocument: CNPJ/CPF do fornecedor/cliente (apenas o número, sem o texto "CNPJ" ou "CPF")
            - supplierAddress: endereço completo do fornecedor/cliente
            
            DETALHES DO SERVIÇO:
            - serviceType: tipo de serviço executado
            - itemCount: quantidade de itens (número)
            - unit: unidade de medida (ex: kg, m³, unidades)
            - totalWeight: peso total (número, apenas o valor sem unidade)
            - totalVolume: volume total (número, apenas o valor sem unidade)
            - unitPrice: preço unitário (número, apenas o valor sem R$ ou símbolos)
            
            VALORES:
            - serviceTotal: valor do serviço (número, apenas o valor sem R$ ou símbolos)
            - additionalValue: valor adicional ou taxas (número, apenas o valor sem R$ ou símbolos)
            - discountValue: valor de desconto (número, apenas o valor sem R$ ou símbolos)
            - totalAmount: valor total a pagar (número, apenas o valor sem R$ ou símbolos)
            - returnAmount: valor de troco ou remonte (número, apenas o valor sem R$ ou símbolos)
            
            INFORMAÇÕES ADICIONAIS:
            - vehiclePlate: placa do veículo (apenas o número da placa)
            - responsible: nome do responsável ou assinatura
            - paymentMethod: forma de pagamento (ex: dinheiro, cartão, PIX)
            - pixKey: chave PIX ou dados bancários
            - email: e-mail para envio do comprovante
            - notes: observações ou informações adicionais relevantes
            - cityState: cidade/UF da operação (ex: São Paulo/SP)
            
            IMPORTANTE:
            - Extraia os valores numéricos sem símbolos de moeda ou unidades
            - Seja preciso nas informações extraídas, evite incluir textos adicionais ou prefixos
            - Se algum valor numérico estiver no formato brasileiro (ex: 1.234,56), converta para o formato numérico sem pontos e com ponto como separador decimal (1234.56)
            - Se algum campo não estiver presente no recibo, não o inclua no JSON
            - Retorne apenas o JSON, sem textos explicativos adicionais
            - Não invente informações que não estejam explícitas no recibo`
          },
          {
            role: "user",
            content: ocrText
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API do OpenAI:", errorData);
      throw new Error(`Erro na API do OpenAI: ${response.status}`);
    }

    const data_response = await response.json();
    console.log("Resposta bruta do GPT:", data_response.choices[0].message.content);
    const result = JSON.parse(data_response.choices[0].message.content);
    console.log("Campos extraídos pelo GPT:", Object.keys(result).length, "campos");
    
    return result;
  } catch (error: any) {
    console.error("Erro ao processar com GPT:", error);
    toast.error(error.message || "Falha ao analisar o recibo com GPT");
    throw error;
  }
};
