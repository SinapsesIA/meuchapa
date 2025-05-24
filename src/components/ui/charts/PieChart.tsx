
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartProps } from "./types";
import { processChartData } from "./utils";

export function PieChart({
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
        <RechartsPieChart>
          <Pie
            data={processedData.labels.map((label: string, i: number) => ({
              name: label,
              value: processedData.datasets[0].data[i],
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {processedData.labels.map((_: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  Array.isArray(processedData.datasets[0].backgroundColor)
                    ? processedData.datasets[0].backgroundColor[index % processedData.datasets[0].backgroundColor.length]
                    : "#8884d8"
                }
              />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
