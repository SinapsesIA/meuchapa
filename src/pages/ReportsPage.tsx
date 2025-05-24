
import { useReports } from "@/hooks/useReports";
import { Layout } from "@/components/layout/Layout";
import { ReportFilterCard } from "@/components/reports/ReportFilterCard";
import { ReportStatCards } from "@/components/reports/ReportStatCards";
import { ReportTabs } from "@/components/reports/ReportTabs";
import { ReportPeriodSelect } from "@/components/reports/ReportPeriodSelect";

export default function ReportsPage() {
  const {
    loading,
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
  } = useReports();

  const chartData = generateChartData();

  return (
    <Layout>
      <main className="container mx-auto py-6 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <ReportPeriodSelect 
            period={period} 
            onPeriodChange={setPeriod} 
          />
        </div>
        
        {/* Search filters */}
        <ReportFilterCard onFilterChange={handleSearch} />
        
        {/* Summary cards */}
        <ReportStatCards 
          stats={stats} 
          pendingCount={pendingCount}
          paidCount={paidCount}
          formatCurrency={formatCurrency}
        />
        
        {/* Charts and tables */}
        <ReportTabs
          loading={loading}
          filteredReceipts={filteredReceipts}
          chartData={chartData}
          formatCurrency={formatCurrency}
          handleViewReceipt={handleViewReceipt}
        />
      </main>
    </Layout>
  );
}
