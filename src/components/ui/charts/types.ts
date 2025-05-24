
import React from "react";

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any;
  groupSmallValues?: boolean;
  smallValueThreshold?: number;
}
