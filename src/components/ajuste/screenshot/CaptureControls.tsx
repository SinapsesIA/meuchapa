
import React from 'react';
import { Button } from "@/components/ui/button";

interface CaptureControlsProps {
  onClear: () => void;
  onCapture: () => void;
}

export function CaptureControls({ onClear, onCapture }: CaptureControlsProps) {
  return (
    <div className="flex gap-2 justify-end">
      <Button 
        variant="outline" 
        onClick={onClear}
        type="button"
        size="sm"
      >
        Limpar anotações
      </Button>
      <Button 
        variant="secondary" 
        onClick={onCapture}
        type="button"
        size="sm"
      >
        Nova captura
      </Button>
    </div>
  );
}
