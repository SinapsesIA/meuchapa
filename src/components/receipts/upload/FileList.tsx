
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing-ocr' | 'processing-ai' | 'completed' | 'error';
  currentFile?: string;
  error?: string;
}

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onProcessFiles: () => void;
  isUploading: boolean;
  uploadProgress: number;
  processingState: ProcessingState;
}

export function FileList({ 
  files, 
  onRemoveFile, 
  onProcessFiles, 
  isUploading, 
  uploadProgress,
  processingState
}: FileListProps) {
  const getStatusMessage = () => {
    switch (processingState.status) {
      case 'uploading':
        return 'Iniciando processamento...';
      case 'processing-ocr':
        return `Processando OCR do arquivo: ${processingState.currentFile}`;
      case 'processing-ai':
        return `Extraindo dados com IA: ${processingState.currentFile}`;
      case 'completed':
        return 'Processamento concluído!';
      case 'error':
        return processingState.error || 'Erro no processamento';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Arquivos para processamento</h3>
      <div className="grid gap-2">
        {files.map((file, index) => (
          <Card key={index}>
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileUp className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={() => onRemoveFile(-1)}
          disabled={isUploading}
        >
          Limpar
        </Button>
        <Button 
          onClick={onProcessFiles}
          disabled={isUploading || !files.length}
        >
          {isUploading ? "Processando..." : "Processar Recibos"}
        </Button>
      </div>
      
      {(isUploading || processingState.status !== 'idle') && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <Alert>
            <AlertDescription className="text-sm">
              {getStatusMessage()}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
