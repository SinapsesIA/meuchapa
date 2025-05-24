import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Truck, Package2 } from "lucide-react";
import { Receipt } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchReceiptsSummary() {
  const { data, error } = await supabase
    .from("receipts")
    .select("*");
  
  if (error) {
    throw error;
  }
  
  // Transform Supabase data to match Receipt type
  const receipts: Receipt[] = data.map(item => ({
    id: item.id,
    imageUrl: item.image_url || "",
    ocrText: item.ocr_text || "",
    processedAt: new Date(item.processed_at),
    paymentStatus: item.payment_status as "pending" | "paid" | "contested",
    companyName: item.company_name,
    totalAmount: item.total_amount,
    supplierName: item.supplier_name,
    totalWeight: item.total_weight,
    serviceType: item.service_type,
    // ... other fields
  }));
  
  // Calculate totals
  const totalReceipts = receipts.length;
  
  const totalValue = receipts.reduce((sum, receipt) => 
    sum + (receipt.totalAmount || 0), 0
  );
  
  const uniqueSuppliers = new Set(
    receipts.map(receipt => receipt.supplierName).filter(Boolean)
  ).size;
  
  const totalWeight = receipts.reduce((sum, receipt) => 
    sum + (receipt.totalWeight || 0), 0
  );

  return {
    totalReceipts,
    totalValue: totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    totalSuppliers: uniqueSuppliers,
    totalVolume: `${totalWeight.toLocaleString('pt-BR')} kg`
  };
}

export function DashboardSummary() {
  const { data: summaryData, isLoading, error } = useQuery({
    queryKey: ['receiptsSummary'],
    queryFn: fetchReceiptsSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show default values if there's an error
  const displayData = error ? {
    totalReceipts: 0,
    totalValue: "R$ 0,00",
    totalSuppliers: 0,
    totalVolume: "0 kg"
  } : summaryData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Recibos
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{displayData?.totalReceipts}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Valor Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="text-2xl font-bold">{displayData?.totalValue}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Fornecedores
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{displayData?.totalSuppliers}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Volume Total
          </CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{displayData?.totalVolume}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
