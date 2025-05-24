
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ScreenshotFormProps {
  description: string;
  setDescription: (description: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ScreenshotForm({ description, setDescription, onSubmit, onCancel, isSubmitting }: ScreenshotFormProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição do ajuste desejado:
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o ajuste ou melhoria que você gostaria de sugerir..."
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          type="button"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || !description.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Sugestão'
          )}
        </Button>
      </div>
    </>
  );
}
