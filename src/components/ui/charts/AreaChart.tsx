
import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartProps } from "./types";

export function AreaChart({
  data,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data.labels.map((label: string, i: number) => ({
          name: label,
          value: data.datasets[0].data[i]
        }))}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={data.datasets[0].borderColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={data.datasets[0].borderColor}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={data.datasets[0].borderColor}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
