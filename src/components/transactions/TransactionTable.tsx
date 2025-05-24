
import { Receipt } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Loader2 } from "lucide-react";

interface TransactionTableProps {
  receipts: Receipt[];
  isLoading: boolean;
  searchTerm: string;
  onViewReceipt: (id: string) => void;
  onDeleteReceipt: (id: string) => void;
  formatDate: (dateValue?: string | Date) => string;
  formatCurrency: (value?: number) => string;
}

export function TransactionTable({ 
  receipts, 
  isLoading, 
  searchTerm,
  onViewReceipt, 
  onDeleteReceipt,
  formatDate,
  formatCurrency
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando dados...</span>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-1">Nenhum recibo encontrado</h3>
        <p className="text-muted-foreground">
          {searchTerm 
            ? "Nenhum recibo corresponde aos termos de busca." 
            : "Não há recibos armazenados no banco de dados."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Nº Recibo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>
                {formatDate(receipt.documentDate || receipt.processedAt)}
              </TableCell>
              <TableCell>{receipt.supplierName || "N/A"}</TableCell>
              <TableCell>{receipt.serviceType || "N/A"}</TableCell>
              <TableCell>{receipt.receiptNumber || "N/A"}</TableCell>
              <TableCell>{receipt.vehiclePlate || "N/A"}</TableCell>
              <TableCell>{formatCurrency(receipt.totalAmount)}</TableCell>
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
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewReceipt(receipt.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteReceipt(receipt.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
