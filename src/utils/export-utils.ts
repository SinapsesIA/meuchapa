
import { format } from "date-fns";
import { Receipt } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ExportOptions {
  filteredReceipts: Receipt[];
  format: "excel" | "pdf";
}

export const exportReport = ({ filteredReceipts, format: exportFormat }: ExportOptions) => {
  const { toast } = useToast();

  try {
    // Generate the file content
    let content = "";
    let filename = "";
    
    if (exportFormat === "excel") {
      // Create CSV content for Excel
      content = "Data,Número,Fornecedor,Serviço,Placa,Valor,Status\n";
      
      filteredReceipts.forEach(receipt => {
        // Format date
        const formattedDate = receipt.documentDate || 
                            (receipt.processedAt ? format(new Date(receipt.processedAt), "dd/MM/yyyy") : "N/A");
        
        // Format payment status
        const status = receipt.paymentStatus === "paid" ? "Pago" : 
                       receipt.paymentStatus === "contested" ? "Contestado" : "Pendente";
        
        // Format amount
        const amount = receipt.totalAmount ? receipt.totalAmount.toString().replace('.', ',') : "0";
        
        // Escape any commas in text fields
        const receiptNumber = `"${receipt.receiptNumber || "N/A"}"`;
        const supplier = `"${receipt.supplierName || "N/A"}"`;
        const service = `"${receipt.serviceType || "N/A"}"`;
        const plate = `"${receipt.vehiclePlate || "N/A"}"`;
        
        // Add the row
        content += `${formattedDate},${receiptNumber},${supplier},${service},${plate},${amount},${status}\n`;
      });
      
      filename = `relatorio-recibos-${format(new Date(), "dd-MM-yyyy")}.csv`;
    } else {
      // For PDF, create a simple HTML table that will be converted to PDF
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Recibos</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Relatório de Recibos</h1>
          <p>Data de geração: ${format(new Date(), "dd/MM/yyyy")}</p>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Número</th>
                <th>Fornecedor</th>
                <th>Serviço</th>
                <th>Placa</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      filteredReceipts.forEach(receipt => {
        // Format date
        const formattedDate = receipt.documentDate || 
                            (receipt.processedAt ? format(new Date(receipt.processedAt), "dd/MM/yyyy") : "N/A");
        
        // Format payment status
        const status = receipt.paymentStatus === "paid" ? "Pago" : 
                       receipt.paymentStatus === "contested" ? "Contestado" : "Pendente";
        
        // Format amount with currency
        const formatCurrency = (value?: number) => {
          if (value === undefined || value === null) return "N/A";
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);
        };
        
        const amount = receipt.totalAmount ? formatCurrency(receipt.totalAmount) : "N/A";
        
        // Add the row
        content += `
          <tr>
            <td>${formattedDate}</td>
            <td>${receipt.receiptNumber || "N/A"}</td>
            <td>${receipt.supplierName || "N/A"}</td>
            <td>${receipt.serviceType || "N/A"}</td>
            <td>${receipt.vehiclePlate || "N/A"}</td>
            <td>${amount}</td>
            <td>${status}</td>
          </tr>
        `;
      });
      
      content += `
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      filename = `relatorio-recibos-${format(new Date(), "dd-MM-yyyy")}.html`;
    }
    
    // Create a blob with the content
    const blob = new Blob([content], { 
      type: exportFormat === "excel" 
        ? "text/csv;charset=utf-8;" 
        : "text/html;charset=utf-8;" 
    });
    
    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: `Relatório exportado como ${exportFormat.toUpperCase()}`,
      description: "O relatório foi exportado com sucesso.",
    });

    return true;
  } catch (error) {
    console.error(`Error exporting ${exportFormat} report:`, error);
    toast({
      title: `Erro ao exportar relatório`,
      description: "Ocorreu um problema ao gerar o arquivo de relatório.",
      variant: "destructive",
    });

    return false;
  }
};
