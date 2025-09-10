"use client";

import { IStock } from "@/types/common.interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = { data: IStock[] };

export default function SectorOverviewSection({ data }: Props) {
  // Aggregate total investment and present value per sector
  const sectorMap = data.reduce((acc, stock) => {
    const sector = stock.category || "Unknown";
    acc[sector] ??= { investment: 0, presentValue: 0, count: 0 };
    acc[sector].investment += stock.investment;
    acc[sector].presentValue += stock.presentValue ?? 0;
    acc[sector].count++;
    return acc;
  }, {} as Record<string, { investment: number; presentValue: number; count: number }>);

  const chartData = Object.entries(sectorMap).map(([sector, vals]) => ({
    sector,
    investment: vals.investment,
    presentValue: vals.presentValue,
    avgPresentValue: vals.count ? vals.presentValue / vals.count : 0,
  }));

  const config = chartData.reduce((cfg, item, i) => {
    const key = item.sector;
    cfg[key] = {
      label: key,
      color: `hsl(${(i * 360) / chartData.length},70%,50%)`,
    };
    return cfg;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sector Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col ">
        <div className="flex-grow h-fit w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="4 2" />
                <XAxis
                  dataKey="sector"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <ChartTooltip />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="avgPresentValue"
                  fill="var(--chart-1)"
                  name="Avg Present Value"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-48  w-4/5 mx-auto">
          {chartData.map((item) => (
            <div key={item.sector} className="text-sm truncate">
              <strong>{item.sector}</strong>
              <br />
              Avg Value: ₹{item.avgPresentValue.toLocaleString("en-IN")}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
