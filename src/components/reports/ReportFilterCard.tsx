
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportFilterCardProps {
  onFilterChange: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    supplier?: string;
    serviceType?: string;
    vehiclePlate?: string;
    receiptNumber?: string;
    paymentStatus?: string;
  }) => void;
}

export function ReportFilterCard({ onFilterChange }: ReportFilterCardProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [supplier, setSupplier] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSearch = () => {
    onFilterChange({
      dateFrom,
      dateTo,
      supplier,
      serviceType,
      vehiclePlate,
      receiptNumber,
      paymentStatus: paymentStatus === "all" ? "" : paymentStatus,
    });
  };

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Pesquisa
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Data Inicial</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Data Final</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Fornecedor</div>
            <Input
              placeholder="Nome do fornecedor"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Tipo de Serviço</div>
            <Input
              placeholder="Tipo de serviço"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Nº do Recibo</div>
            <Input
              placeholder="Número do recibo"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Placa do Veículo</div>
            <Input
              placeholder="Ex: ABC1234"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Status de Pagamento</div>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="contested">Contestado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
