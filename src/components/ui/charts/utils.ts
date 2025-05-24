
import { cn } from "@/lib/utils";

// Process data to group small values if needed
export function processChartData(data: any, groupSmallValues = false, smallValueThreshold = 5) {
  if (!groupSmallValues) return data;
  
  // Calculate total to determine percentages
  const total = data.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0);
  
  // Separate data into two categories: main items and small items
  const mainItems: { names: string[], values: number[], indices: number[] } = { names: [], values: [], indices: [] };
  const smallItems: { names: string[], values: number[] } = { names: [], values: [] };
  
  data.labels.forEach((label: string, index: number) => {
    const value = data.datasets[0].data[index];
    const percentage = (value / total) * 100;
    
    if (percentage >= smallValueThreshold) {
      mainItems.names.push(label);
      mainItems.values.push(value);
      mainItems.indices.push(index);
    } else {
      smallItems.names.push(label);
      smallItems.values.push(value);
    }
  });
  
  // Create new data structure with grouped small values
  if (smallItems.values.length > 0) {
    const smallItemsSum = smallItems.values.reduce((sum: number, value: number) => sum + value, 0);
    
    return {
      labels: [...mainItems.names, "Outros"],
      datasets: [{
        ...data.datasets[0],
        data: [...mainItems.values, smallItemsSum],
        backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
          ? [...mainItems.indices.map((i: number) => data.datasets[0].backgroundColor[i % data.datasets[0].backgroundColor.length]), "#999999"]
          : data.datasets[0].backgroundColor
      }]
    };
  }
  
  return data;
}
