
import React from 'react';
import { Loader2 } from "lucide-react";

export function ScreenshotCapturing() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Capturando tela...</p>
    </div>
  );
}
