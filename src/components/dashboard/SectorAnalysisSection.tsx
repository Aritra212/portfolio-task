"use client";

import { IStock } from "@/types/common.interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
  data: IStock[];
};

export default function SectorAnalysisSection({ data }: Props) {
  // 1. Aggregate data by sector
  const sectorMap: Record<string, number> = {};
  data.forEach((stock) => {
    const sector = stock.category || "Unknown";
    sectorMap[sector] = (sectorMap[sector] || 0) + (stock.presentValue ?? 0);
  });

  const chartData = Object.entries(sectorMap).map(([category, value]) => ({
    name: category,
    value,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // 2. Prepare chart config
  const chartConfig = chartData.reduce((conf, item, index) => {
    const key = item.name;
    conf[key] = {
      label: key,
      color: `hsl(${(index * 360) / chartData.length}, 70%, 50%)`,
    };
    return conf;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sector Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="w-full md:w-1/2 h-[300px]">
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={chartConfig[entry.name].color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend/List */}
          <div className="w-full md:w-1/2 space-y-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 block rounded"
                  style={{ backgroundColor: chartConfig[item.name].color }}
                />
                <span>
                  {item.name}: {((item.value / total) * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
