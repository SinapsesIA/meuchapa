
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export function useApiKeys() {
  const [googleVisionKey, setGoogleVisionKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load API keys from database
  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data: apiKeys, error } = await supabase
        .from('user_api_keys')
        .select('google_vision_key, openai_key')
        .maybeSingle();

      if (error) {
        console.error('Error loading API keys:', error);
        toast.error('Falha ao carregar chaves de API');
        return;
      }

      if (apiKeys) {
        setGoogleVisionKey(apiKeys.google_vision_key || '');
        setOpenAIKey(apiKeys.openai_key || '');
      }
    } catch (error) {
      console.error('Erro ao carregar chaves de API:', error);
      toast.error('Falha ao carregar chaves de API');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  // Save API keys to database
  const saveApiKeys = async (googleKey: string, openaiKey: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate input keys
      if (!googleKey || !openaiKey) {
        toast.error('Por favor, preencha todas as chaves de API');
        return false;
      }
      
      // Generate a new ID for the first entry or use existing
      const { data: existingKeys, error: fetchError } = await supabase
        .from('user_api_keys')
        .select('id')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is fine for new entries
        console.error('Error fetching existing keys:', fetchError);
        toast.error('Falha ao verificar chaves existentes');
        return false;
      }
      
      const id = existingKeys?.id || uuidv4();
      
      // Use upsert with explicit insert/update operations
      const { error: upsertError } = await supabase
        .from('user_api_keys')
        .upsert({ 
          id,
          google_vision_key: googleKey, 
          openai_key: openaiKey,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Error updating API keys:', upsertError);
        toast.error('Falha ao atualizar chaves de API');
        return false;
      }

      setGoogleVisionKey(googleKey);
      setOpenAIKey(openaiKey);
      
      toast.success('Chaves de API atualizadas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar chaves de API:', error);
      toast.error('Falha ao atualizar chaves de API');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh keys
  const refreshKeys = async () => {
    setIsLoading(true);
    try {
      await loadApiKeys();
    } catch (error) {
      console.error('Erro ao recarregar chaves:', error);
      toast.error('Falha ao recarregar chaves de API');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    googleVisionKey,
    openAIKey,
    setGoogleVisionKey,
    setOpenAIKey,
    isLoading,
    saveApiKeys,
    refreshKeys
  };
}
