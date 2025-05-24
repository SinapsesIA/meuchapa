
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function BackupSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Backup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Backup Automático</p>
            <p className="text-sm text-gray-500">Realizar backups automáticos do banco de dados</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="space-y-2">
          <Label htmlFor="backup-frequency">Frequência do Backup</Label>
          <select id="backup-frequency" className="w-full p-2 border rounded-md">
            <option value="daily">Diário</option>
            <option value="weekly" selected>Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="backup-retention">Retenção de Backups (dias)</Label>
          <Input id="backup-retention" type="number" min="1" defaultValue="30" />
        </div>
        <Button className="mt-2">Realizar Backup Manual</Button>
      </CardContent>
    </Card>
  );
}
