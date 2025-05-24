
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "@/types";

interface VolumesSectionProps {
  receipt: Receipt;
  isEditing: boolean;
  onFieldChange: (field: keyof Receipt, value: any) => void;
}

export function VolumesSection({ receipt, isEditing, onFieldChange }: VolumesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volumes e Valores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totalWeight">Peso Total (kg)</Label>
          <Input
            id="totalWeight"
            type="number"
            value={receipt.totalWeight || ""}
            onChange={(e) => onFieldChange("totalWeight", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalVolume">Volume Total</Label>
          <Input
            id="totalVolume"
            type="number"
            value={receipt.totalVolume || ""}
            onChange={(e) => onFieldChange("totalVolume", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Preço Unitário</Label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            value={receipt.unitPrice || ""}
            onChange={(e) => onFieldChange("unitPrice", Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
