
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Receipt } from "@/types";

export function useReportFilters(receipts: Receipt[], setFilteredReceipts: (receipts: Receipt[]) => void) {
  const { toast } = useToast();
  const [period, setPeriod] = useState("6m");

  const handleSearch = (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    supplier?: string;
    serviceType?: string;
    vehiclePlate?: string;
    receiptNumber?: string;
    paymentStatus?: string;
  }) => {
    let filtered = [...receipts];
    
    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter(receipt => {
        if (!receipt.documentDate) return false;
        const receiptDate = new Date(receipt.documentDate);
        return receiptDate >= filters.dateFrom! && receiptDate <= filters.dateTo!;
      });
    }
    
    if (filters.supplier) {
      filtered = filtered.filter(receipt => 
        receipt.supplierName?.toLowerCase().includes(filters.supplier!.toLowerCase())
      );
    }
    
    if (filters.serviceType) {
      filtered = filtered.filter(receipt => 
        receipt.serviceType?.toLowerCase().includes(filters.serviceType!.toLowerCase())
      );
    }
    
    if (filters.vehiclePlate) {
      filtered = filtered.filter(receipt => 
        receipt.vehiclePlate?.toLowerCase().includes(filters.vehiclePlate!.toLowerCase())
      );
    }
    
    if (filters.receiptNumber) {
      filtered = filtered.filter(receipt => 
        receipt.receiptNumber?.toLowerCase().includes(filters.receiptNumber!.toLowerCase())
      );
    }
    
    if (filters.paymentStatus) {
      filtered = filtered.filter(receipt => 
        receipt.paymentStatus === filters.paymentStatus
      );
    }
    
    setFilteredReceipts(filtered);
    
    toast({
      title: "Pesquisa realizada",
      description: `Encontrados ${filtered.length} recibos que atendem aos critérios.`,
    });
  };

  return { period, setPeriod, handleSearch };
}
