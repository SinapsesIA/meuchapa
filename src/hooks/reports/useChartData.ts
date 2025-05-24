
import { Receipt } from "@/types";

export function useChartData(receipts: Receipt[]) {
  const generateChartData = () => {
    // Service type distribution
    const serviceTypes = new Map<string, number>();
    receipts.forEach(receipt => {
      const type = receipt.serviceType || "Sem categoria";
      serviceTypes.set(type, (serviceTypes.get(type) || 0) + 1);
    });
    
    const serviceTypeData = {
      labels: Array.from(serviceTypes.keys()),
      datasets: [{
        label: "Tipos de Serviço",
        data: Array.from(serviceTypes.values()),
        backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
          "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#6366f1"
        ],
      }]
    };
    
    // Supplier distribution
    const suppliers = new Map<string, number>();
    receipts.forEach(receipt => {
      const supplier = receipt.supplierName || "Não especificado";
      suppliers.set(supplier, (suppliers.get(supplier) || 0) + 1);
    });
    
    const topSuppliers = Array.from(suppliers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    const supplierData = {
      labels: topSuppliers.map(s => s[0]),
      datasets: [{
        label: "Fornecedores",
        data: topSuppliers.map(s => s[1]),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      }]
    };
    
    // Payment status distribution
    const paymentStatus = {
      "pending": receipts.filter(r => r.paymentStatus === "pending").length,
      "paid": receipts.filter(r => r.paymentStatus === "paid").length,
      "contested": receipts.filter(r => r.paymentStatus === "contested").length,
    };
    
    const statusData = {
      labels: ["Pendente", "Pago", "Contestado"],
      datasets: [{
        label: "Status de Pagamento",
        data: [paymentStatus.pending, paymentStatus.paid, paymentStatus.contested],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      }]
    };
    
    // Monthly costs data
    const monthlyData = new Map<string, number>();
    receipts.forEach(receipt => {
      if (!receipt.documentDate) return;
      const month = receipt.documentDate.substring(0, 7); // YYYY-MM
      const amount = receipt.totalAmount || 0;
      monthlyData.set(month, (monthlyData.get(month) || 0) + amount);
    });
    
    const sortedMonths = Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6); // Last 6 months
      
    const costData = {
      labels: sortedMonths.map(m => {
        const [year, month] = m[0].split('-');
        return `${month}/${year.substring(2)}`;
      }),
      datasets: [{
        label: "Custos Mensais",
        data: sortedMonths.map(m => m[1]),
        backgroundColor: "#ef4444",
      }]
    };
    
    return { serviceTypeData, supplierData, statusData, costData };
  };

  return { generateChartData };
}
