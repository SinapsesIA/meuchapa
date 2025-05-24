
import { useRef, useState, useEffect } from 'react';
import { useScreenshotCapture } from './ScreenshotCapture';
import { useAjusteFormSubmission } from './AjusteSubmission';

interface UseScreenshotDialogProps {
  onSuccess: () => void;
  open: boolean;
}

export function useScreenshotDialog({ onSuccess, open }: UseScreenshotDialogProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);
  
  const { isCapturing, captureScreen } = useScreenshotCapture();
  const { description, setDescription, handleSubmit, isSubmitting } = useAjusteFormSubmission({
    onSuccess
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      handleCaptureScreen();
    } else {
      // Reset state when dialog closes
      setScreenshot(null);
      setAnnotatedImage(null);
      setDescription('');
      setCaptureError(null);
    }
  }, [open]);

  const handleCaptureScreen = async () => {
    const result = await captureScreen();
    if (result.dataUrl) {
      setScreenshot(result.dataUrl);
      setCaptureError(null);
    } else {
      setCaptureError(result.error);
    }
  };

  const handleSaveAnnotation = (annotatedDataUrl: string) => {
    // Ensure annotated image is also saved as JPEG
    const jpegImage = annotatedDataUrl.replace(/^data:image\/png/, 'data:image/jpeg');
    setAnnotatedImage(jpegImage);
  };

  const handleClearAnnotation = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      setAnnotatedImage(null);
    }
  };

  const handleFormSubmit = () => {
    // Use the annotated image if available, otherwise use the original screenshot
    const imageToSubmit = annotatedImage || screenshot;
    handleSubmit(imageToSubmit);
  };

  return {
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
  };
}
