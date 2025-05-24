
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText } from "lucide-react";

interface ReportStatCardsProps {
  stats: {
    totalAmount: number;
    averageAmount: number;
    receiptsCount: number;
    pendingAmount: number;
    paidAmount: number;
    contestedAmount: number;
  };
  pendingCount: number;
  paidCount: number;
  formatCurrency: (value: number) => string;
}

export function ReportStatCards({ stats, pendingCount, paidCount, formatCurrency }: ReportStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.receiptsCount} recibos no total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageAmount)}</div>
          <p className="text-xs text-muted-foreground">
            Por recibo
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {pendingCount} recibos pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pago</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.paidAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {paidCount} recibos pagos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
