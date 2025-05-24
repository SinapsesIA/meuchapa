
import { useReportData } from "./reports/useReportData";
import { useReportStats } from "./reports/useReportStats";
import { useChartData } from "./reports/useChartData";
import { useReportFilters } from "./reports/useReportFilters";
import { useReportUtils } from "./reports/useReportUtils";

export function useReports() {
  const { receipts, filteredReceipts, setFilteredReceipts, loading } = useReportData();
  const { stats, pendingCount, paidCount } = useReportStats(filteredReceipts);
  const { generateChartData } = useChartData(filteredReceipts);
  const { period, setPeriod, handleSearch } = useReportFilters(receipts, setFilteredReceipts);
  const { formatCurrency, handleViewReceipt } = useReportUtils();
  
  return {
    loading,
    receipts,
    filteredReceipts,
    stats,
    period,
    setPeriod,
    handleSearch,
    formatCurrency,
    generateChartData,
    handleViewReceipt,
    pendingCount,
    paidCount
  };
}
