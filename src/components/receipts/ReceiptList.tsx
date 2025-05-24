
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Trash2,
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Receipt } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ReceiptListProps {
  receipts: Receipt[];
  onDelete: (id: string) => void;
}

export function ReceiptList({ receipts, onDelete }: ReceiptListProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(receipts.length / itemsPerPage);
  
  const paginatedReceipts = receipts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const statusBadgeVariant = (status: Receipt['paymentStatus']) => {
    switch (status) {
      case "paid":
        return "outline";
      case "pending":
        return "secondary";
      case "contested":
        return "destructive";
      default:
        return "outline";
    }
  };

  const statusIcon = (status: Receipt['paymentStatus']) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "contested":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const statusText = (status: Receipt['paymentStatus']) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "contested":
        return "Contestado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    
    try {
      const parsedDate = parseISO(dateString);
      
      if (!isValid(parsedDate)) {
        return "-";
      }
      
      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error, "Date string:", dateString);
      return "-";
    }
  };

  const viewReceipt = (id: string) => {
    console.log("Visualizando recibo ID:", id);
    navigate(`/receipts/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(null);
    onDelete(id);
    toast.success("Recibo excluído com sucesso");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nº Recibo</TableHead>
              <TableHead>Emitente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReceipts.length > 0 ? (
              paginatedReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>
                    {formatDate(receipt.documentDate)}
                  </TableCell>
                  <TableCell>{receipt.receiptNumber || "-"}</TableCell>
                  <TableCell>{receipt.companyName || "-"}</TableCell>
                  <TableCell>{receipt.serviceType || "-"}</TableCell>
                  <TableCell>
                    {receipt.totalAmount 
                      ? `R$ ${receipt.totalAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(receipt.paymentStatus)}>
                      {statusIcon(receipt.paymentStatus)}
                      {statusText(receipt.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewReceipt(receipt.id)}
                        aria-label="Visualizar recibo"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmId(receipt.id)}
                        aria-label="Excluir recibo"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum recibo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {receipts.length > itemsPerPage && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * itemsPerPage + 1} a{" "}
            {Math.min(page * itemsPerPage, receipts.length)} de {receipts.length}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Página {page} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este recibo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
