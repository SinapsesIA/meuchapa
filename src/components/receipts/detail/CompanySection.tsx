
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Receipt } from "@/types";

interface CompanySectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function CompanySection({ receipt, isEditing, onFieldChange }: CompanySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresa Emitente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input
            id="companyName"
            value={receipt.companyName || ""}
            onChange={(e) => onFieldChange("companyName", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyDocument">CNPJ</Label>
          <Input
            id="companyDocument"
            value={receipt.companyDocument || ""}
            onChange={(e) => onFieldChange("companyDocument", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Endereço</Label>
          <Textarea
            id="companyAddress"
            value={receipt.companyAddress || ""}
            onChange={(e) => onFieldChange("companyAddress", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
