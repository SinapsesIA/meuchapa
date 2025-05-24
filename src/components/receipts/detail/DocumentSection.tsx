
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt } from "@/types";

interface DocumentSectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function DocumentSection({ receipt, isEditing, onFieldChange }: DocumentSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Documento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documentDate">Data</Label>
          <Input
            id="documentDate"
            type="date"
            value={receipt.documentDate || ""}
            onChange={(e) => onFieldChange("documentDate", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receiptNumber">Número do Recibo</Label>
          <Input
            id="receiptNumber"
            value={receipt.receiptNumber || ""}
            onChange={(e) => onFieldChange("receiptNumber", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Status de Pagamento</Label>
          <Select 
            disabled={!isEditing}
            value={receipt.paymentStatus} 
            onValueChange={(value) => onFieldChange("paymentStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="contested">Contestado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
