
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { ScreenshotDialog } from './ScreenshotDialog';

export function FloatingAjusteButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        data-floating-ajuste-button
        onClick={() => setIsDialogOpen(true)}
        className="fixed top-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg bg-orange-500 hover:bg-orange-600 p-0 flex items-center justify-center"
      >
        <Wrench className="h-5 w-5 text-white" />
        <span className="sr-only">Ajustar</span>
      </Button>
      
      <ScreenshotDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
}
