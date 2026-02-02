"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/store/tradeStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { ArrowUpDown } from "lucide-react";

const COLORS = {
  long: "#34d399",
  short: "#f87171"
};

export function LongShortRatio() {
  const { metrics, isLoading } = useTradeStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-cyan-400" />
            Long/Short Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Long", value: metrics.longTrades, color: COLORS.long },
    { name: "Short", value: metrics.shortTrades, color: COLORS.short }
  ];

  const total = metrics.longTrades + metrics.shortTrades;
  const longPercentage = total > 0 ? ((metrics.longTrades / total) * 100).toFixed(1) : 0;
  const shortPercentage = total > 0 ? ((metrics.shortTrades / total) * 100).toFixed(1) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <ArrowUpDown className="h-5 w-5 text-cyan-400" />
          Directional Bias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                }}
                formatter={(value, name) => [
                  `${value ?? 0} trades`,
                  String(name)
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats below chart */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Long</p>
              <p className="text-lg font-bold text-slate-100">
                {longPercentage}%
              </p>
              <p className="text-xs text-slate-500">{metrics.longTrades} trades</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-red-500/10 p-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Short</p>
              <p className="text-lg font-bold text-slate-100">
                {shortPercentage}%
              </p>
              <p className="text-xs text-slate-500">{metrics.shortTrades} trades</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

