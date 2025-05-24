
import { File, CheckCircle2, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DuplicateFile {
  file: File;
  index: number;
}

interface DuplicateFilesListProps {
  files: DuplicateFile[];
  onRemoveFile: (index: number) => void;
  onRenameFile: (index: number, newName: string) => void;
}

export function DuplicateFilesList({ 
  files, 
  onRemoveFile,
  onRenameFile 
}: DuplicateFilesListProps) {
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DuplicateFile | null>(null);
  const [newFileName, setNewFileName] = useState("");
  
  const handleRenameClick = (file: DuplicateFile) => {
    setSelectedFile(file);
    // Extract the name without extension
    const fileName = file.file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExtension = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    
    setNewFileName(nameWithoutExtension);
    setOpenRenameDialog(true);
  };
  
  const handleRename = () => {
    if (selectedFile && newFileName) {
      // Get the original file extension
      const fileName = selectedFile.file.name;
      const lastDotIndex = fileName.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
      
      // Create new file name with original extension
      const completeNewName = `${newFileName}${extension}`;
      
      onRenameFile(selectedFile.index, completeNewName);
      setOpenRenameDialog(false);
      setSelectedFile(null);
    }
  };

  if (!files.length) return null;

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h3 className="text-lg font-medium text-yellow-800">Arquivos duplicados detectados</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Os seguintes arquivos já foram processados anteriormente. Você pode renomeá-los para processá-los novamente ou removê-los da lista.
        </p>
      </div>
      
      <div className="grid gap-2">
        {files.map((item) => (
          <Card key={item.index} className="border-yellow-200">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">{item.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRenameClick(item)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Renomear
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFile(item.index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear arquivo</DialogTitle>
            <DialogDescription>
              Digite um novo nome para o arquivo para evitar duplicação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filename">Nome do arquivo</Label>
              <Input 
                id="filename" 
                value={newFileName} 
                onChange={(e) => setNewFileName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRenameDialog(false)}>Cancelar</Button>
            <Button onClick={handleRename}>Renomear e processar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
