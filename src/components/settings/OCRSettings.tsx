import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApiKeys } from "@/hooks/use-api-keys";
import { Loader2, InfoIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OCRSettings() {
  const { 
    googleVisionKey, 
    openAIKey, 
    isLoading,
    saveApiKeys,
    setGoogleVisionKey,
    setOpenAIKey
  } = useApiKeys();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveAPIKeys = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Add console logs for debugging
      console.log("Attempting to save API keys...");
      
      const result = await saveApiKeys(googleVisionKey, openAIKey);
      
      if (!result) {
        setError("Houve um problema ao salvar as chaves. Por favor, tente novamente.");
        console.log("Failed to save API keys");
      } else {
        console.log("API keys saved successfully");
      }
    } catch (err) {
      console.error("Erro ao salvar chaves:", err);
      setError("Erro ao salvar as chaves. Verifique o console para mais detalhes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching keys
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              As chaves de API são armazenadas de forma segura no banco de dados.
            </AlertDescription>
          </Alert>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="google-vision-key">Google Cloud Vision API Key</Label>
            <Input
              id="google-vision-key"
              type="password"
              value={googleVisionKey}
              onChange={(e) => setGoogleVisionKey(e.target.value)}
              placeholder="Insira sua chave do Google Cloud Vision"
            />
            <p className="text-sm text-gray-500">
              Chave necessária para o processamento de OCR com Google Cloud Vision
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="Insira sua chave da OpenAI"
            />
            <p className="text-sm text-gray-500">
              Chave necessária para processamento avançado com GPT
            </p>
          </div>
          <Button 
            onClick={handleSaveAPIKeys} 
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Chaves de API'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de OCR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ocr-confidence">Confiança Mínima (%)</Label>
            <Input id="ocr-confidence" type="number" min="1" max="100" defaultValue="70" />
            <p className="text-sm text-gray-500">
              Define o nível mínimo de confiança para aceitar o resultado do OCR
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Revisão Manual</p>
              <p className="text-sm text-gray-500">
                Exigir revisão manual para resultados abaixo da confiança mínima
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pré-processamento de Imagem</p>
              <p className="text-sm text-gray-500">
                Aplicar filtros para melhorar a qualidade da imagem antes do OCR
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
