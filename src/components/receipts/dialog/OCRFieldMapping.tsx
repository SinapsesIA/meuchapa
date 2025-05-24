
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Receipt } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OCRFieldMappingProps {
  ocrText: string;
  receipt: Receipt;
  onFieldMapping: (lineText: string, field: keyof Receipt) => void;
}

export function OCRFieldMapping({ ocrText, receipt, onFieldMapping }: OCRFieldMappingProps) {
  const [fieldMappings, setFieldMappings] = useState<Record<string, keyof Receipt | undefined>>({});
  
  const receiptFields: Array<{ key: keyof Receipt; label: string }> = [
    { key: "companyName", label: "Nome da Empresa" },
    { key: "companyDocument", label: "CNPJ da Empresa" },
    { key: "companyAddress", label: "Endereço da Empresa" },
    { key: "documentDate", label: "Data do Documento" },
    { key: "receiptNumber", label: "Número do Recibo" },
    { key: "serviceType", label: "Tipo de Serviço" },
    { key: "itemCount", label: "Quantidade de Itens" },
    { key: "unit", label: "Unidade" },
    { key: "totalWeight", label: "Peso Total" },
    { key: "totalVolume", label: "Volume Total" },
    { key: "unitPrice", label: "Preço Unitário" },
    { key: "serviceTotal", label: "Valor do Serviço" },
    { key: "totalAmount", label: "Valor Total" },
    { key: "additionalValue", label: "Valor Adicional" },
    { key: "discountValue", label: "Valor de Desconto" },
    { key: "vehiclePlate", label: "Placa do Veículo" },
    { key: "responsible", label: "Responsável" },
    { key: "paymentMethod", label: "Método de Pagamento" },
    { key: "supplierName", label: "Nome do Fornecedor" },
    { key: "supplierDocument", label: "CNPJ do Fornecedor" },
    { key: "supplierAddress", label: "Endereço do Fornecedor" },
    { key: "pixKey", label: "Chave PIX" },
    { key: "notes", label: "Observações" },
    { key: "email", label: "E-mail" },
  ];

  // Initialize field mappings from current receipt values and identify used OCR lines
  useEffect(() => {
    const initialMappings: Record<string, keyof Receipt | undefined> = {};
    const ocrLines = ocrText.split('\n').filter(line => line.trim());
    
    ocrLines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check each receipt field
      Object.entries(receipt).forEach(([field, value]) => {
        // Skip properties that are not strings or empty
        if (typeof value !== 'string' || !value.trim()) return;
        
        // If the OCR line matches exactly with a stored value, map it
        if (value.trim() === trimmedLine) {
          initialMappings[trimmedLine] = field as keyof Receipt;
        }
      });
    });

    setFieldMappings(initialMappings);
  }, [receipt, ocrText]);

  // Handle field selection with auto-save
  const handleFieldSelect = (lineText: string, field: string) => {
    try {
      const newMappings = { ...fieldMappings, [lineText]: field as keyof Receipt };
      setFieldMappings(newMappings);
      onFieldMapping(lineText, field as keyof Receipt);
      toast.success("Campo associado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar associação:", error);
      toast.error("Erro ao salvar associação do campo");
    }
  };

  // Get all values from the receipt that are strings and not empty
  const usedValues = new Set(
    Object.values(receipt)
      .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
      .map(value => value.trim())
  );

  // Filter OCR lines to show only unused ones
  const ocrLines = ocrText
    .split('\n')
    .filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine !== '' && !usedValues.has(trimmedLine);
    });

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Associação de Campos</h3>
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4">
          {ocrLines.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Todos os textos OCR já foram associados a campos do recibo
            </p>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="py-2 text-left font-medium">Texto OCR</th>
                  <th className="py-2 text-left font-medium">Campo do Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ocrLines.map((line, index) => {
                  const trimmedLine = line.trim();
                  const currentMapping = fieldMappings[trimmedLine];
                  
                  return (
                    <tr key={index}>
                      <td className="py-2 pr-4">
                        <span className="text-sm">{line}</span>
                      </td>
                      <td className="py-2">
                        <Select
                          value={currentMapping?.toString() || ""}
                          onValueChange={(value) => handleFieldSelect(trimmedLine, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            {receiptFields.map((field) => (
                              <SelectItem key={field.key.toString()} value={field.key.toString()}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
