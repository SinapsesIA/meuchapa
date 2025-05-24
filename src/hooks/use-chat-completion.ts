
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Receipt } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatCompletion = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Olá! Estou pronto para ajudar. Me faça perguntas sobre seus recibos.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar os dados dos recibos do localStorage
  const fetchReceiptsData = (): Receipt[] => {
    try {
      const storedReceipts = localStorage.getItem("receipts");
      
      if (storedReceipts) {
        // Converter string JSON para array de recibos
        const parsedReceipts = JSON.parse(storedReceipts);
        
        // Converter strings de data de volta para objetos Date para exibição formatada
        return parsedReceipts.map((receipt: any) => ({
          ...receipt,
          processedAt: new Date(receipt.processedAt)
        }));
      }
      
      return []; // Return empty array if no receipts found
    } catch (error) {
      console.error('Erro ao buscar dados dos recibos:', error);
      return [];
    }
  };

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Buscar dados dos recibos para fornecer como contexto
      const receiptsData = fetchReceiptsData();
      
      // Obter a chave da API do OpenAI da tabela user_api_keys
      const { data: apiKeys, error: apiKeyError } = await supabase
        .from('user_api_keys')
        .select('openai_key')
        .single();
        
      if (apiKeyError || !apiKeys?.openai_key) {
        throw new Error('Chave da API OpenAI não configurada. Configure nas Configurações.');
      }

      // Criar um contexto de sistema com os dados disponíveis
      const systemMessage = {
        role: 'system',
        content: `Você é um assistente especializado em análise de recibos e dados de transporte chamado "Meu Chapa". 
        Use os dados disponíveis para responder às perguntas do usuário de forma clara e estruturada.
        Sempre responda com:
        1. Um parágrafo explicativo sobre o resultado
        2. Uma tabela em formato markdown se aplicável
        3. Mencione as opções de exportação disponíveis (CSV, Excel, PDF) quando relevante
        
        Dados disponíveis dos recibos: ${JSON.stringify(receiptsData)}
        `
      };

      // Fazer a chamada para a API do OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openai_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            systemMessage,
            ...updatedMessages.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API OpenAI: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      // Salvar a nova mensagem e a resposta no banco de dados
      const sessionId = crypto.randomUUID();
      
      await supabase.from('chat_sessions').insert({
        id: sessionId,
        title: userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '')
      });
      
      await supabase.from('chat_messages').insert([
        { session_id: sessionId, role: 'user', content: userMessage },
        { session_id: sessionId, role: 'assistant', content: assistantResponse }
      ]);

      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error: any) {
      console.error('Erro na solicitação de chat', error);
      toast.error(error.message || 'Falha na comunicação com o assistente de IA');
      
      // Adicionar mensagem de erro amigável ao usuário
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Desculpe, ocorreu um erro ao processar sua solicitação. ' + 
                   'Verifique se a chave da API OpenAI está configurada corretamente nas Configurações.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};
