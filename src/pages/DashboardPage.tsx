
import { Layout } from "@/components/layout/Layout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  return (
    <Layout loading={loading}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardSummary />
        <DashboardCharts />
      </div>
    </Layout>
  );
}
