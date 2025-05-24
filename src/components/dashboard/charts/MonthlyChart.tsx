
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@/components/ui/charts";

interface MonthlyChartProps {
  monthlyData: {
    labels: string[];
    data: number[];
  };
}

export function MonthlyChart({ monthlyData }: MonthlyChartProps) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Valor Total por Mês (R$)</CardTitle>
      </CardHeader>
      <CardContent>
        {monthlyData.labels.length > 0 ? (
          <AreaChart
            data={{
              labels: monthlyData.labels,
              datasets: [
                {
                  label: "Valor (R$)",
                  data: monthlyData.data,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderColor: "rgb(59, 130, 246)",
                  borderWidth: 2,
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
            className="aspect-[2/1]"
          />
        ) : (
          <div className="flex justify-center items-center p-12 h-48 text-muted-foreground">
            Não há dados suficientes para exibir este gráfico
          </div>
        )}
      </CardContent>
    </Card>
  );
}
