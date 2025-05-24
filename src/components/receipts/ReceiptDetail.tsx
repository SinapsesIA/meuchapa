
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt } from "@/types";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { OCRTextDisplay } from "./dialog/OCRTextDisplay";
import { OCRFieldMapping } from "./dialog/OCRFieldMapping";
import { CompanySection } from "./detail/CompanySection";
import { SupplierSection } from "./detail/SupplierSection";
import { DocumentSection } from "./detail/DocumentSection";
import { ServiceSection } from "./detail/ServiceSection";
import { VolumesSection } from "./detail/VolumesSection";
import { AmountsSection } from "./detail/AmountsSection";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptDetailProps {
  receipt: Receipt;
  onSave: (updatedReceipt: Receipt) => void;
}

export function ReceiptDetail({ receipt, onSave }: ReceiptDetailProps) {
  const [editedReceipt, setEditedReceipt] = useState<Receipt>({ ...receipt });
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleChange = (field: keyof Receipt, value: any) => {
    setEditedReceipt((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedReceipt);
    setIsEditing(false);
    toast.success("Recibo atualizado com sucesso!");
  };

  const handleFieldMapping = (lineText: string, field: keyof Receipt) => {
    setEditedReceipt((prev) => ({
      ...prev,
      [field]: lineText.trim()
    }));
  };

  // Function to get a public URL for the image
  const getPublicImageUrl = (imageUrl: string) => {
    // Check if the URL is already a Supabase storage URL
    if (imageUrl.includes('storage/v1/object/public')) {
      return imageUrl;
    }

    // If it's a path in the storage bucket, construct a public URL
    if (imageUrl.startsWith('receipts/')) {
      const { data } = supabase.storage.from('receipts').getPublicUrl(imageUrl);
      return data.publicUrl;
    }

    // Return the original URL if it's an external URL
    return imageUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Detalhes do Recibo {receipt.receiptNumber || receipt.id}
        </h2>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Dados do Recibo</TabsTrigger>
          <TabsTrigger value="image">Imagem Original</TabsTrigger>
          <TabsTrigger value="ocr">Texto OCR</TabsTrigger>
          <TabsTrigger value="mapping">Associação</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompanySection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
            <SupplierSection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
            <DocumentSection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
            <ServiceSection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
            <VolumesSection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
            <AmountsSection 
              receipt={editedReceipt}
              isEditing={isEditing}
              onFieldChange={handleChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Imagem Original do Recibo</CardTitle>
              <CardDescription>
                Este é o documento original enviado para processamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {receipt.imageUrl ? (
                imageError ? (
                  <div className="text-center py-12 bg-muted rounded-md">
                    <p className="text-lg text-muted-foreground mb-2">Não foi possível carregar a imagem</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setImageError(false);
                        setImageLoading(true);
                      }}
                    >
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <div className="relative border rounded-md overflow-hidden">
                    <AspectRatio ratio={4/3} className="bg-muted">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                      )}
                      <img
                        src={getPublicImageUrl(receipt.imageUrl)}
                        alt="Recibo Original"
                        className="object-contain w-full h-full"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageLoading(false)}
                        style={{ display: imageLoading ? 'none' : 'block' }}
                      />
                    </AspectRatio>
                    <div className="absolute bottom-2 right-2">
                      <a 
                        href={getPublicImageUrl(receipt.imageUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2"
                      >
                        Ver em tamanho real
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-12 bg-muted rounded-md">
                  <p className="text-muted-foreground">Imagem não disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr">
          <Card>
            <CardHeader>
              <CardTitle>Texto Extraído por OCR</CardTitle>
              <CardDescription>
                Este é o texto extraído da imagem do recibo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OCRTextDisplay ocrText={receipt.ocrText || "Texto OCR não disponível"} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Associação de Campos</CardTitle>
              <CardDescription>
                Associe manualmente as linhas do texto OCR aos campos do recibo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OCRFieldMapping
                ocrText={receipt.ocrText || ""}
                receipt={editedReceipt}
                onFieldMapping={handleFieldMapping}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
