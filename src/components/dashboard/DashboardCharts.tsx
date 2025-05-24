
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import { ChartLoadingState } from "./charts/LoadingState";
import { MonthlyChart } from "./charts/MonthlyChart";
import { CompanyChart } from "./charts/CompanyChart";
import { ServiceChart } from "./charts/ServiceChart";

export function DashboardCharts() {
  const { monthlyData, companyData, serviceData, loading } = useDashboardCharts();

  if (loading) {
    return <ChartLoadingState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MonthlyChart monthlyData={monthlyData} />
      <CompanyChart companyData={companyData} />
      <ServiceChart serviceData={serviceData} />
    </div>
  );
}
