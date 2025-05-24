
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { toast } from "@/components/ui/use-toast";

export interface ScreenshotCaptureResult {
  dataUrl: string | null;
  error: string | null;
}

export function useScreenshotCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  
  const captureScreen = async (): Promise<ScreenshotCaptureResult> => {
    setIsCapturing(true);
    
    try {
      console.log('Capturing screen...');
      // Temporarily hide the floating button during capture
      const floatingButton = document.querySelector('[data-floating-ajuste-button]');
      if (floatingButton) {
        floatingButton.classList.add('opacity-0');
      }
      
      // Wait a bit to ensure the button is hidden
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the app container (excluding the dialog itself)
      const appElement = document.querySelector('#root');
      if (!appElement) {
        throw new Error('Não foi possível encontrar o elemento contêiner da aplicação');
      }
      
      // Use html2canvas as a function directly
      const canvas = await html2canvas(appElement as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          return element.classList.contains('screenshot-dialog');
        }
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG format with 90% quality
      console.log('Screenshot captured successfully');
      
      // Show the floating button again
      if (floatingButton) {
        floatingButton.classList.remove('opacity-0');
      }

      setIsCapturing(false);
      return { dataUrl, error: null };
    } catch (error) {
      console.error('Erro ao capturar screenshot:', error);
      const errorMessage = (error as Error).message || 'Erro desconhecido ao capturar tela';
      
      toast({
        variant: "destructive",
        title: "Erro de captura",
        description: 'Falha ao capturar tela. Por favor, tente novamente.'
      });
      
      setIsCapturing(false);
      return { dataUrl: null, error: errorMessage };
    }
  };

  return {
    isCapturing,
    captureScreen
  };
}
