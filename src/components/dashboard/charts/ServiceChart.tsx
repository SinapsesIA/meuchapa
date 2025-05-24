
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts";

interface ServiceChartProps {
  serviceData: {
    labels: string[];
    data: number[];
  };
}

export function ServiceChart({ serviceData }: ServiceChartProps) {
  return (
    <Card className="col-span-full md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Serviços por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        {serviceData.labels.length > 0 ? (
          <BarChart
            data={{
              labels: serviceData.labels,
              datasets: [
                {
                  label: "Quantidade",
                  data: serviceData.data,
                  backgroundColor: "rgb(59, 130, 246)",
                },
              ],
            }}
            groupSmallValues={true}
            smallValueThreshold={5}
            className="aspect-[3/2]"
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
