
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart } from "@/components/ui/charts";
import { Loader2 } from "lucide-react";
import { Receipt } from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportTabsProps {
  loading: boolean;
  filteredReceipts: Receipt[];
  chartData: {
    serviceTypeData: any;
    supplierData: any;
    statusData: any;
    costData: any;
  };
  formatCurrency: (value: number) => string;
  handleViewReceipt: (id: string) => void;
}

export function ReportTabs({ loading, filteredReceipts, chartData, formatCurrency, handleViewReceipt }: ReportTabsProps) {
  return (
    <Tabs defaultValue="charts" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
        <TabsTrigger value="status">Status de Pagamento</TabsTrigger>
        <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
        <TabsTrigger value="details">Detalhado</TabsTrigger>
      </TabsList>
      
      <TabsContent value="charts" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Custos por Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <BarChart data={chartData.costData} />
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <PieChart 
                  data={chartData.serviceTypeData} 
                  groupSmallValues={true}
                  smallValueThreshold={5}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="status" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : (
              <PieChart data={chartData.statusData} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="suppliers" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Fornecedor (Top 5)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : (
              <PieChart 
                data={chartData.supplierData}
                groupSmallValues={true}
                smallValueThreshold={5}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualização Detalhada dos Recibos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Carregando dados...</span>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nº do Recibo</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.length > 0 ? (
                      filteredReceipts.map((receipt) => (
                        <TableRow key={receipt.id} className="cursor-pointer" onClick={() => handleViewReceipt(receipt.id)}>
                          <TableCell>{receipt.documentDate || (receipt.processedAt ? format(receipt.processedAt, "dd/MM/yyyy") : "N/A")}</TableCell>
                          <TableCell>{receipt.receiptNumber || "N/A"}</TableCell>
                          <TableCell>{receipt.supplierName || "N/A"}</TableCell>
                          <TableCell>{receipt.serviceType || "N/A"}</TableCell>
                          <TableCell>{receipt.vehiclePlate || "N/A"}</TableCell>
                          <TableCell>{receipt.totalAmount ? formatCurrency(receipt.totalAmount) : "N/A"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                receipt.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : receipt.paymentStatus === "contested"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {receipt.paymentStatus === "paid"
                                ? "Pago"
                                : receipt.paymentStatus === "contested"
                                ? "Contestado"
                                : "Pendente"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Nenhum recibo encontrado com os filtros atuais.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
