
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface ReportPeriodSelectProps {
  period: string;
  onPeriodChange: (value: string) => void;
}

export function ReportPeriodSelect({ period, onPeriodChange }: ReportPeriodSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={period} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[180px]">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1m">Último mês</SelectItem>
          <SelectItem value="3m">Últimos 3 meses</SelectItem>
          <SelectItem value="6m">Últimos 6 meses</SelectItem>
          <SelectItem value="1y">Último ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
