
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { analyzeWithAI } from '@/services/ai-analysis';
import { uploadScreenshot } from '@/services/screenshot-upload';
import { AjusteSubmissionInput } from '@/types/ajuste-submission';
import { MelhoriaCategoriaType, MelhoriaUrgenciaType } from '@/types/melhorias';

/**
 * Hook for submitting ajustes (improvement suggestions)
 */
export function useAjusteSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submits an ajuste with description and screenshot
   */
  const submitAjuste = async ({ description, imageBase64 }: AjusteSubmissionInput) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting ajuste submission process');
      
      // Upload the screenshot to storage
      let imageUrl;
      try {
        imageUrl = await uploadScreenshot(imageBase64);
        console.log('Screenshot upload successful:', imageUrl);
        
        // Check if the result is still a base64 string (fallback mode)
        const isBase64Fallback = typeof imageUrl === 'string' && imageUrl.startsWith('data:image/');
        if (isBase64Fallback) {
          console.log('Using base64 fallback mode - storage bucket not available');
          toast({
            description: 'Usando modo alternativo para armazenar imagens.'
          });
        }
      } catch (uploadError) {
        console.error('Erro de upload:', uploadError);
        // Continue with base64 as fallback
        imageUrl = imageBase64;
        toast({
          description: 'Usando modo alternativo para armazenar imagens.'
        });
      }
      
      // Analisar com IA
      let aiAnalysis;
      try {
        aiAnalysis = await analyzeWithAI(description, imageBase64);
        console.log('Análise de IA bem-sucedida:', aiAnalysis);
      } catch (aiError) {
        console.error('Erro de análise de IA:', aiError);
        // Continuar com valores padrão se a análise de IA falhar
        aiAnalysis = {
          title: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
          category: 'Sugestão' as MelhoriaCategoriaType,
          urgency: 'Média' as MelhoriaUrgenciaType,
          summary: 'Resumo não disponível (falha na análise de IA)'
        };
        console.log('Usando valores padrão para análise de IA:', aiAnalysis);
      }
      
      // Criar uma nova entrada em melhorias_ajustes
      const fullDescription = `${description}\n\n---\nAnálise de IA:\n${aiAnalysis.summary || 'Não disponível'}`;
      
      console.log('Salvando ajuste no banco de dados...');
      const { data, error } = await supabase
        .from('melhorias_ajustes')
        .insert({
          titulo: aiAnalysis.title || 'Sugestão de ajuste',
          descricao: fullDescription,
          categoria: aiAnalysis.category || 'Sugestão',
          urgencia: aiAnalysis.urgency || 'Média',
          imagem_url: imageUrl,
          status: 'Pendente',
          usuario_id: null // Será nulo para usuários anônimos
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Erro de banco de dados ao inserir melhoria:', error);
        throw error;
      }
      
      console.log('Registro de melhoria criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro na função submitAjuste:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitAjuste,
    isSubmitting
  };
}
