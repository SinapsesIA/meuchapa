
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ScreenshotFailureProps {
  onRetry: () => void;
  errorMessage?: string | null;
}

export function ScreenshotFailure({ onRetry, errorMessage }: ScreenshotFailureProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-amber-500" />
      <p className="text-lg font-medium">Falha ao capturar a tela.</p>
      
      {errorMessage && (
        <div className="bg-muted p-3 rounded-md text-sm max-w-full overflow-auto">
          <p className="text-muted-foreground break-words">{errorMessage}</p>
        </div>
      )}
      
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  );
}
