import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  isUploading: boolean;
}

export function DropZone({ onFileSelect, isUploading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    validateAndAddFiles(Array.from(e.target.files));
  };

  const validateAndAddFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/png" || 
      file.type === "application/pdf"
    );
    
    if (validFiles.length !== files.length) {
      toast.error("Apenas arquivos JPEG, PNG e PDF são permitidos.");
    }
    
    onFileSelect(validFiles);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium">
            Arraste e solte arquivos aqui
          </h3>
          <p className="text-sm text-gray-500">
            ou clique para selecionar arquivos
          </p>
          <p className="text-xs text-gray-500">
            JPEG, PNG, PDF (max 10MB)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => document.getElementById("fileInput")?.click()}
          disabled={isUploading}
        >
          Selecionar Arquivos
        </Button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          multiple
          accept=".jpeg,.jpg,.png,.pdf"
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
}
