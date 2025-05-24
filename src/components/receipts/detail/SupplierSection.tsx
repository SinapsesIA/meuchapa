
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Receipt } from "@/types";

interface SupplierSectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function SupplierSection({ receipt, isEditing, onFieldChange }: SupplierSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transportadora</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supplierName">Nome da Transportadora</Label>
          <Input
            id="supplierName"
            value={receipt.supplierName || ""}
            onChange={(e) => onFieldChange("supplierName", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplierDocument">CNPJ</Label>
          <Input
            id="supplierDocument"
            value={receipt.supplierDocument || ""}
            onChange={(e) => onFieldChange("supplierDocument", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplierAddress">Endereço</Label>
          <Textarea
            id="supplierAddress"
            value={receipt.supplierAddress || ""}
            onChange={(e) => onFieldChange("supplierAddress", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
