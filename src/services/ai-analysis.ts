
import { MelhoriaCategoriaType, MelhoriaUrgenciaType } from '@/types/melhorias';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIAnalysisResult {
  title: string;
  category: MelhoriaCategoriaType;
  urgency: MelhoriaUrgenciaType;
  summary: string;
}

/**
 * Analyzes a screenshot and description using OpenAI
 */
export const analyzeWithAI = async (
  description: string,
  imageBase64: string
): Promise<OpenAIAnalysisResult> => {
  try {
    // Get the OpenAI API key from user_api_keys
    const { data: apiKeys, error: apiKeyError } = await supabase
      .from('user_api_keys')
      .select('openai_key')
      .single();

    if (apiKeyError || !apiKeys?.openai_key) {
      throw new Error('Chave de API OpenAI não configurada nas configurações');
    }

    const openAIKey = apiKeys.openai_key;
    
    // Remove base64 prefix if present
    const base64Image = imageBase64.startsWith('data:image')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que interpreta sugestões de ajuste ou melhoria em aplicações web.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Aqui está uma sugestão de ajuste:\n\nDescrição: ${description}\n\n` +
                      'Por favor analise a descrição e a imagem, e retorne um JSON com os seguintes campos:\n' +
                      '- title: um título conciso para esta solicitação de melhoria\n' +
                      '- category: a categoria da solicitação (Bug, Sugestão, Recurso Novo, Ajuste Visual, ou Outro)\n' +
                      '- urgency: a urgência estimada (Baixa, Média ou Alta)\n' +
                      '- summary: um resumo estruturado da solicitação'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`Erro na API OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    return {
      title: aiResponse.title,
      category: aiResponse.category as MelhoriaCategoriaType,
      urgency: aiResponse.urgency as MelhoriaUrgenciaType,
      summary: aiResponse.summary
    };
  } catch (error) {
    console.error('Error analyzing with AI:', error);
    throw new Error('Falha ao analisar com IA: ' + (error as Error).message);
  }
};
