
import { Loader2 } from "lucide-react";

export function ChartLoadingState() {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <span>Carregando dados dos gráficos...</span>
    </div>
  );
}
