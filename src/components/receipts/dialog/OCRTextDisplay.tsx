
import { ScrollArea } from "@/components/ui/scroll-area";

interface OCRTextDisplayProps {
  ocrText: string;
}

export function OCRTextDisplay({ ocrText }: OCRTextDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Dados do Recibo</h3>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Texto OCR</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ocrText}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
