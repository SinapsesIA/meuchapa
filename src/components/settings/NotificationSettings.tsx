
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Novos Recibos</p>
            <p className="text-sm text-gray-500">
              Receber notificações quando novos recibos forem processados
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Erros de Processamento</p>
            <p className="text-sm text-gray-500">
              Receber notificações sobre erros no processamento de recibos
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Atualizações do Sistema</p>
            <p className="text-sm text-gray-500">
              Receber notificações sobre atualizações do sistema
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
}
