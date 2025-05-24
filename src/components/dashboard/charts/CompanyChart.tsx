
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/ui/charts";

interface CompanyChartProps {
  companyData: {
    labels: string[];
    data: number[];
  };
}

export function CompanyChart({ companyData }: CompanyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valor Total por Emissor</CardTitle>
      </CardHeader>
      <CardContent>
        {companyData.labels.length > 0 ? (
          <PieChart
            data={{
              labels: companyData.labels,
              datasets: [
                {
                  label: "Valor Total (R$)",
                  data: companyData.data,
                  backgroundColor: [
                    "rgb(59, 130, 246)",
                    "rgb(99, 102, 241)",
                    "rgb(139, 92, 246)",
                    "rgb(168, 85, 247)",
                    "rgb(217, 70, 239)",
                  ],
                  hoverOffset: 4,
                },
              ],
            }}
            groupSmallValues={true}
            smallValueThreshold={5}
            className="aspect-square w-full"
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
