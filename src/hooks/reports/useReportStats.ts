
import { useMemo } from "react";
import { Receipt } from "@/types";

export function useReportStats(receipts: Receipt[]) {
  const stats = useMemo(() => {
    const totalAmount = receipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
    const receiptsCount = receipts.length;
    const averageAmount = receiptsCount > 0 ? totalAmount / receiptsCount : 0;
    
    const pendingAmount = receipts
      .filter(receipt => receipt.paymentStatus === "pending")
      .reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
      
    const paidAmount = receipts
      .filter(receipt => receipt.paymentStatus === "paid")
      .reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
      
    const contestedAmount = receipts
      .filter(receipt => receipt.paymentStatus === "contested")
      .reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
    
    return {
      totalAmount,
      averageAmount,
      receiptsCount,
      pendingAmount,
      paidAmount,
      contestedAmount
    };
  }, [receipts]);

  const pendingCount = useMemo(() => 
    receipts.filter(r => r.paymentStatus === "pending").length, 
    [receipts]
  );

  const paidCount = useMemo(() => 
    receipts.filter(r => r.paymentStatus === "paid").length, 
    [receipts]
  );

  return { stats, pendingCount, paidCount };
}
