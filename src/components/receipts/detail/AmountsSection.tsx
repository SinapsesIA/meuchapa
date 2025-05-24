
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "@/types";

interface AmountsSectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function AmountsSection({ receipt, isEditing, onFieldChange }: AmountsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores Finais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceTotal">Valor do Serviço</Label>
          <Input
            id="serviceTotal"
            type="number"
            step="0.01"
            value={receipt.serviceTotal || ""}
            onChange={(e) => onFieldChange("serviceTotal", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalValue">Valor Adicional</Label>
          <Input
            id="additionalValue"
            type="number"
            step="0.01"
            value={receipt.additionalValue || ""}
            onChange={(e) => onFieldChange("additionalValue", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">Valor de Desconto</Label>
          <Input
            id="discountValue"
            type="number"
            step="0.01"
            value={receipt.discountValue || ""}
            onChange={(e) => onFieldChange("discountValue", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Valor Total</Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.01"
            value={receipt.totalAmount || ""}
            onChange={(e) => onFieldChange("totalAmount", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
