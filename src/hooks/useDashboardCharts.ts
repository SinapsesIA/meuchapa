
import { useState, useEffect } from "react";
import { Receipt } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isValid } from "date-fns";

export function useDashboardCharts() {
  const [monthlyData, setMonthlyData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });
  
  const [companyData, setCompanyData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });
  
  const [serviceData, setServiceData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch all receipts from Supabase
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
          companyDocument: item.company_document,
          companyAddress: item.company_address,
          documentDate: item.document_date,
          receiptNumber: item.receipt_number,
          supplierName: item.supplier_name,
          supplierDocument: item.supplier_document,
          supplierAddress: item.supplier_address,
          serviceType: item.service_type,
          itemCount: item.item_count,
          unit: item.unit,
          totalWeight: item.total_weight,
          totalVolume: item.total_volume,
          unitPrice: item.unit_price,
          serviceTotal: item.service_total,
          additionalValue: item.additional_value,
          discountValue: item.discount_value,
          totalAmount: item.total_amount,
          returnAmount: item.return_amount,
          vehiclePlate: item.vehicle_plate,
          responsible: item.responsible,
          paymentMethod: item.payment_method,
          pixKey: item.pix_key,
          email: item.email,
          notes: item.notes,
          cityState: item.city_state
        }));

        // Process Monthly Value Data
        const monthlyValues = new Map<string, number>();
        receipts.forEach(receipt => {
          if (receipt.documentDate && isValid(parseISO(receipt.documentDate))) {
            const monthKey = format(parseISO(receipt.documentDate), "MMM/yy");
            const currentValue = monthlyValues.get(monthKey) || 0;
            monthlyValues.set(monthKey, currentValue + (receipt.totalAmount || 0));
          }
        });

        // Process Company Data
        const companyTotals = new Map<string, number>();
        receipts.forEach(receipt => {
          if (receipt.companyName && receipt.totalAmount) {
            const currentTotal = companyTotals.get(receipt.companyName) || 0;
            companyTotals.set(receipt.companyName, currentTotal + receipt.totalAmount);
          }
        });

        // Process Service Type Data
        const serviceTotals = new Map<string, number>();
        receipts.forEach(receipt => {
          if (receipt.serviceType) {
            const currentCount = serviceTotals.get(receipt.serviceType!) || 0;
            serviceTotals.set(receipt.serviceType!, currentCount + 1);
          }
        });

        // Sort and limit data for better visualization
        const sortedMonths = Array.from(monthlyValues.entries())
          .sort((a, b) => {
            // Parse the month/year format and compare dates
            const dateA = parseISO(`01/${a[0].replace('MMM/', '')}`);
            const dateB = parseISO(`01/${b[0].replace('MMM/', '')}`);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(-6);

        const sortedCompanies = Array.from(companyTotals.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const sortedServices = Array.from(serviceTotals.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setMonthlyData({
          labels: sortedMonths.map(([month]) => month),
          data: sortedMonths.map(([_, value]) => value),
        });

        setCompanyData({
          labels: sortedCompanies.map(([company]) => company || "Desconhecido"),
          data: sortedCompanies.map(([_, value]) => value),
        });

        setServiceData({
          labels: sortedServices.map(([service]) => service || "Desconhecido"),
          data: sortedServices.map(([_, count]) => count),
        });
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return {
    monthlyData,
    companyData,
    serviceData,
    loading
  };
}
