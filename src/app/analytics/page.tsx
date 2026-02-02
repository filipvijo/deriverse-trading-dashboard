"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CumulativePnLChart } from "@/components/charts/CumulativePnLChart";
import { VolumeFeesChart } from "@/components/charts/VolumeFeesChart";
import { WinLossDistribution } from "@/components/charts/WinLossDistribution";
import { LongShortRatio } from "@/components/charts/LongShortRatio";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { metrics, isLoading } = useTradeStore();

  const detailedStats = [
    { label: "Gross Profit", value: formatCurrency(metrics.grossProfit), color: "text-emerald-400" },
    { label: "Gross Loss", value: formatCurrency(metrics.grossLoss), color: "text-red-400" },
    { label: "Net PnL", value: formatCurrency(metrics.totalPnl), color: metrics.totalPnl >= 0 ? "text-emerald-400" : "text-red-400" },
    { label: "Total Volume", value: formatCurrency(metrics.totalVolume), color: "text-cyan-400" },
    { label: "Total Fees", value: formatCurrency(metrics.totalFees), color: "text-amber-400" },
    { label: "Largest Win", value: formatCurrency(metrics.largestWin), color: "text-emerald-400" },
    { label: "Largest Loss", value: formatCurrency(Math.abs(metrics.largestLoss)), color: "text-red-400" },
    { label: "Expectancy", value: formatCurrency(metrics.expectancy), color: metrics.expectancy >= 0 ? "text-emerald-400" : "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400">
          Deep dive into your trading performance metrics
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Detailed Stats Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-cyan-400" />
            Detailed Statistics
          </CardTitle>
          <CardDescription>Comprehensive breakdown of your trading metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {detailedStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p className={`text-lg font-bold font-mono ${stat.color}`}>
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CumulativePnLChart />
        <LongShortRatio />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VolumeFeesChart />
        <WinLossDistribution />
      </div>
    </div>
  );
}

