"use client";

import { IStock } from "@/types/common.interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";

import { type ChartConfig } from "@/components/ui/chart";
import { Banknote, TrendingUp } from "lucide-react";
import StatCard from "../ui/cards/stat-card";

const performanceChartConfig = {
  investment: {
    label: "Investment",
    icon: Banknote,
    color: "var(--chart-1)",
  },
  presentValue: {
    label: "Present Value",
    icon: TrendingUp,
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = { data: IStock[] };

export default function PerformanceSection({ data }: Props) {
  const totalInvestment = data.reduce((sum, i) => sum + i.investment, 0);
  const totalPresent = data.reduce((sum, i) => sum + (i.presentValue ?? 0), 0);
  const totalGainLoss = totalPresent - totalInvestment;
  const gainLossPct = totalInvestment
    ? ((totalGainLoss / totalInvestment) * 100).toFixed(2)
    : "0.00";

  const chartData = data.map((i) => ({
    name: i.particulars,
    investment: i.investment,
    presentValue: i.presentValue ?? 0,
  }));

  return (
    <div className="space-y-6 p-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Investment" value={totalInvestment} />
        <StatCard title="Present Value" value={totalPresent} />
        <StatCard
          title="Gain / Loss"
          value={totalGainLoss}
          percentage={parseFloat(gainLossPct)}
          isGain={totalGainLoss >= 0}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Investment vs Present Value</CardTitle>
        </CardHeader>
        <CardContent className="px-10">
          <ChartContainer
            config={performanceChartConfig}
            className="min-h-[100px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                angle={-60}
                tick={{ fontSize: 12 }}
                textAnchor="end"
              />
              <ChartTooltip />
              <ChartLegend
                content={<ChartLegendContent />}
                className="mt-10 text-base"
              />
              <Bar dataKey="investment" fill="var(--chart-1)" radius={4} />
              <Bar dataKey="presentValue" fill="var(--chart-2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
