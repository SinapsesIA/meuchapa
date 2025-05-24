
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnnotationCanvas } from './AnnotationCanvas';
import { ScreenshotCapturing } from './screenshot/ScreenshotCapturing';
import { CaptureControls } from './screenshot/CaptureControls';
import { ScreenshotForm } from './screenshot/ScreenshotForm';
import { ScreenshotFailure } from './screenshot/ScreenshotFailure';
import { useScreenshotDialog } from './screenshot/useScreenshotDialog';

interface ScreenshotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScreenshotDialog({ open, onOpenChange }: ScreenshotDialogProps) {
  const {
    screenshot,
    annotatedImage,
    captureError,
    canvasRef,
    isCapturing,
    description,
    isSubmitting,
    setDescription,
    handleCaptureScreen,
    handleSaveAnnotation,
    handleClearAnnotation,
    handleFormSubmit
  } = useScreenshotDialog({ 
    onSuccess: () => onOpenChange(false),
    open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="screenshot-dialog max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sugerir Ajuste</DialogTitle>
        </DialogHeader>

        {isCapturing ? (
          <ScreenshotCapturing />
        ) : screenshot ? (
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <AnnotationCanvas 
                ref={canvasRef}
                backgroundImage={screenshot} 
                onSave={handleSaveAnnotation}
              />
            </div>
            
            <CaptureControls 
              onClear={handleClearAnnotation}
              onCapture={handleCaptureScreen}
            />
            
            <ScreenshotForm 
              description={description}
              setDescription={setDescription}
              onSubmit={handleFormSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <ScreenshotFailure 
            onRetry={handleCaptureScreen} 
            errorMessage={captureError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
