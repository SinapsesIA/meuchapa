
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, FileText, File } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterOptions } from "@/types";

interface ReceiptFilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  onExport: (format: "excel" | "pdf") => void;
}

export function ReceiptFilterBar({
  onFilterChange,
  onExport,
}: ReceiptFilterBarProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [supplier, setSupplier] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [serviceType, setServiceType] = useState<string>("all");
  const [vehiclePlate, setVehiclePlate] = useState<string>("");

  const handleSearch = () => {
    const filters: FilterOptions = {};
    
    if (dateFrom && dateTo) {
      filters.dateRange = { start: dateFrom, end: dateTo };
    }
    
    if (supplier && supplier !== "all") filters.supplier = supplier;
    if (location && location !== "all") filters.location = location;
    if (serviceType && serviceType !== "all") filters.serviceType = serviceType;
    if (vehiclePlate) filters.vehiclePlate = vehiclePlate;
    
    onFilterChange(filters);
  };

  return (
    <div className="space-y-4">
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
          <Select value={supplier} onValueChange={setSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os fornecedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os fornecedores</SelectItem>
              <SelectItem value="trans-norte">Trans Norte</SelectItem>
              <SelectItem value="log-express">Log Express</SelectItem>
              <SelectItem value="rapido-sul">Rápido Sul</SelectItem>
              <SelectItem value="trans-brasil">Trans Brasil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Localização</div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as localizações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as localizações</SelectItem>
              <SelectItem value="sao-paulo">São Paulo, SP</SelectItem>
              <SelectItem value="rio-de-janeiro">Rio de Janeiro, RJ</SelectItem>
              <SelectItem value="belo-horizonte">Belo Horizonte, MG</SelectItem>
              <SelectItem value="brasilia">Brasília, DF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Tipo de Serviço</div>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="carga">Carga</SelectItem>
              <SelectItem value="descarga">Descarga</SelectItem>
              <SelectItem value="entrega">Entrega</SelectItem>
              <SelectItem value="coleta">Coleta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Placa do Veículo</div>
          <Input
            placeholder="Ex: ABC1234"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Pesquisar
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onExport("excel")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport("pdf")}
          >
            <File className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
