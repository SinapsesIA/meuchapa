
import React, { useState } from 'react';
import { useAjusteSubmission } from '@/hooks/use-ajuste-submission';
import { toast } from "@/components/ui/use-toast";

interface AjusteSubmissionProps {
  onSuccess: () => void;
}

export function useAjusteFormSubmission({ onSuccess }: AjusteSubmissionProps) {
  const [description, setDescription] = useState('');
  const { submitAjuste, isSubmitting } = useAjusteSubmission();

  const handleSubmit = async (imageToSubmit: string | null) => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Descrição necessária",
        description: 'Por favor, adicione uma descrição do ajuste desejado.'
      });
      return;
    }

    try {
      console.log('Submitting ajuste...');
      if (!imageToSubmit) {
        toast({
          variant: "destructive",
          title: "Imagem não disponível",
          description: 'Não foi possível obter a imagem da tela.'
        });
        return;
      }

      await submitAjuste({
        description,
        imageBase64: imageToSubmit
      });
      
      toast({
        title: "Sucesso!",
        description: 'Sua sugestão foi registrada com sucesso! Obrigado por contribuir com melhorias.'
      });
      onSuccess();
    } catch (error) {
      console.error('Erro ao enviar ajuste:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        variant: "destructive",
        title: "Falha no envio",
        description: `Erro ao enviar o ajuste: ${errorMessage}. Verifique se o sistema está configurado corretamente.`
      });
    }
  };

  return {
    description,
    setDescription,
    handleSubmit,
    isSubmitting
  };
}
