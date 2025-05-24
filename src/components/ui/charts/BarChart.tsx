
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartProps } from "./types";
import { processChartData } from "./utils";

export function BarChart({
  data,
  className,
  groupSmallValues = false,
  smallValueThreshold = 5,
  ...props
}: ChartProps) {
  // Process data to group small values if needed
  const processedData = processChartData(data, groupSmallValues, smallValueThreshold);
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={processedData.labels.map((label: string, i: number) => ({
            name: label,
            value: processedData.datasets[0].data[i],
          }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            fill={
              Array.isArray(processedData.datasets[0].backgroundColor)
                ? (entry: any, index: number) => processedData.datasets[0].backgroundColor[index % processedData.datasets[0].backgroundColor.length]
                : processedData.datasets[0].backgroundColor
            }
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
