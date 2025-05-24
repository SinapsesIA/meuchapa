
import { Receipt } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExtractedDataDisplayProps {
  receipt: Receipt;
  isAIEnhanced?: boolean;
}

export function ExtractedDataDisplay({ receipt, isAIEnhanced }: ExtractedDataDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        Dados Extraídos 
        {isAIEnhanced && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">
            Aprimorado com IA Avançada
          </span>
        )}
      </h3>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Fornecedor</p>
            <p className="text-sm text-muted-foreground">{receipt.supplierName || "Não identificado"}</p>
          </div>
          {receipt.supplierDocument && (
            <div>
              <p className="text-sm font-medium">CNPJ do Fornecedor</p>
              <p className="text-sm text-muted-foreground">{receipt.supplierDocument}</p>
            </div>
          )}
          {receipt.companyAddress && (
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">{receipt.companyAddress}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Tipo de Serviço</p>
            <p className="text-sm text-muted-foreground">{receipt.serviceType || "Não identificado"}</p>
          </div>
          {receipt.itemCount && (
            <div>
              <p className="text-sm font-medium">Quantidade de Itens</p>
              <p className="text-sm text-muted-foreground">{receipt.itemCount}</p>
            </div>
          )}
          {receipt.totalWeight && (
            <div>
              <p className="text-sm font-medium">Peso Total</p>
              <p className="text-sm text-muted-foreground">{receipt.totalWeight} kg</p>
            </div>
          )}
          {receipt.unitPrice && (
            <div>
              <p className="text-sm font-medium">Preço Unitário</p>
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(receipt.unitPrice)}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Valor Total</p>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(receipt.totalAmount || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Data do Documento</p>
            <p className="text-sm text-muted-foreground">
              {receipt.documentDate || "Não identificado"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Número do Recibo</p>
            <p className="text-sm text-muted-foreground">{receipt.receiptNumber}</p>
          </div>
          {receipt.vehiclePlate && (
            <div>
              <p className="text-sm font-medium">Placa do Veículo</p>
              <p className="text-sm text-muted-foreground">{receipt.vehiclePlate}</p>
            </div>
          )}
          {receipt.responsible && (
            <div>
              <p className="text-sm font-medium">Responsável</p>
              <p className="text-sm text-muted-foreground">{receipt.responsible}</p>
            </div>
          )}
          {receipt.paymentMethod && (
            <div>
              <p className="text-sm font-medium">Forma de Pagamento</p>
              <p className="text-sm text-muted-foreground">{receipt.paymentMethod}</p>
            </div>
          )}
          {receipt.notes && (
            <div>
              <p className="text-sm font-medium">Observações</p>
              <p className="text-sm text-muted-foreground">{receipt.notes}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
