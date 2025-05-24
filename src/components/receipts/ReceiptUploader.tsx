
import { useState } from "react";
import { Receipt } from "@/types";
import { DropZone } from "./upload/DropZone";
import { FileList } from "./upload/FileList";
import { ProcessedReceipts } from "./upload/ProcessedReceipts";
import { OCRPreviewDialog } from "./OCRPreviewDialog";
import { useReceiptProcessor } from "@/hooks/use-receipt-processor";
import { updateReceiptInSupabase } from "@/utils/receipt-utils";
import { toast } from "sonner";
import { DuplicateFilesList } from "./upload/DuplicateFilesList";
import { checkFileProcessed } from "@/utils/file-utils";

export function ReceiptUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [duplicateFiles, setDuplicateFiles] = useState<{ file: File; index: number }[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [processedReceipts, setProcessedReceipts] = useState<Receipt[]>([]);
  const { 
    uploading, 
    progress, 
    processingState, 
    processReceipts 
  } = useReceiptProcessor();

  const handleFileSelect = async (newFiles: File[]) => {
    // Check for duplicates before adding to list
    const existingFileNames = new Set(files.map(f => f.name));
    const duplicates: { file: File; index: number }[] = [...duplicateFiles];
    const uniqueFiles: File[] = [];
    
    for (const file of newFiles) {
      // Skip if the file is already in our list
      if (existingFileNames.has(file.name)) continue;
      
      // Check if the file was processed before (in database)
      const isProcessed = await checkFileProcessed(file.name);
      
      if (isProcessed) {
        // Add to duplicates array with the index it would have had
        duplicates.push({ 
          file, 
          index: files.length + uniqueFiles.length
        });
      } else {
        // Add to unique files
        uniqueFiles.push(file);
      }
    }
    
    // Update state
    setFiles(prev => [...prev, ...uniqueFiles]);
    setDuplicateFiles(duplicates);
  };

  const removeFile = (indexToRemove: number) => {
    if (indexToRemove === -1) {
      setFiles([]);
    } else {
      setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }
  };

  const removeDuplicateFile = (indexToRemove: number) => {
    setDuplicateFiles(prev => prev.filter(item => item.index !== indexToRemove));
  };

  const renameDuplicateFile = (index: number, newName: string) => {
    // Find the duplicate file
    const duplicateFile = duplicateFiles.find(item => item.index === index);
    if (!duplicateFile) return;
    
    // Create a new File object with the new name but same content
    const oldFile = duplicateFile.file;
    
    // Create a file with a new name
    const renamedFile = new File([oldFile], newName, { 
      type: oldFile.type,
      lastModified: oldFile.lastModified
    });
    
    // Add to files array
    setFiles(prev => [...prev, renamedFile]);
    
    // Remove from duplicates
    removeDuplicateFile(index);
    
    toast.success(`Arquivo renomeado para "${newName}" e adicionado para processamento`);
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    
    try {
      const results = await processReceipts(files);
      
      if (results.length > 0) {
        setProcessedReceipts(prev => [...prev, ...results]);
        setFiles([]);
      }
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      toast.error("Ocorreu um erro ao processar os arquivos");
    }
  };

  const updateReceipt = async (updatedReceipt: Receipt) => {
    try {
      // Update in Supabase
      const success = await updateReceiptInSupabase(updatedReceipt);
      
      if (success) {
        // Update local state
        setProcessedReceipts(prevReceipts => 
          prevReceipts.map(receipt => 
            receipt.id === updatedReceipt.id ? updatedReceipt : receipt
          )
        );
        
        if (selectedReceipt?.id === updatedReceipt.id) {
          setSelectedReceipt(updatedReceipt);
        }
        
        toast.success("Recibo atualizado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao atualizar recibo:", error);
      toast.error("Erro ao atualizar recibo");
    }
  };

  return (
    <div className="space-y-6">
      <DropZone onFileSelect={handleFileSelect} isUploading={uploading} />
      
      {duplicateFiles.length > 0 && (
        <DuplicateFilesList
          files={duplicateFiles}
          onRemoveFile={removeDuplicateFile}
          onRenameFile={renameDuplicateFile}
        />
      )}
      
      {files.length > 0 && (
        <FileList
          files={files}
          onRemoveFile={removeFile}
          onProcessFiles={handleProcessFiles}
          isUploading={uploading}
          uploadProgress={progress}
          processingState={processingState}
        />
      )}

      {processedReceipts.length > 0 && (
        <ProcessedReceipts
          receipts={processedReceipts}
          onViewReceipt={setSelectedReceipt}
        />
      )}

      <OCRPreviewDialog
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onUpdate={updateReceipt}
      />
    </div>
  );
}
