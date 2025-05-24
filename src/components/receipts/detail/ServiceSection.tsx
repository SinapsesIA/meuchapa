
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "@/types";

interface ServiceSectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function ServiceSection({ receipt, isEditing, onFieldChange }: ServiceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceType">Tipo de Serviço</Label>
          <Input
            id="serviceType"
            value={receipt.serviceType || ""}
            onChange={(e) => onFieldChange("serviceType", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemCount">Quantidade de Itens</Label>
          <Input
            id="itemCount"
            type="number"
            value={receipt.itemCount || ""}
            onChange={(e) => onFieldChange("itemCount", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <Input
            id="unit"
            value={receipt.unit || ""}
            onChange={(e) => onFieldChange("unit", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
