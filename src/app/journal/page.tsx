"use client";

import { TradeTable } from "@/components/journal/TradeTable";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { BookOpen, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export default function JournalPage() {
  const { metrics, isLoading } = useTradeStore();

  const quickStats = [
    {
      label: "Total Trades",
      value: metrics.totalTrades.toString(),
      icon: BookOpen,
      color: "text-cyan-400"
    },
    {
      label: "Winning Trades",
      value: metrics.winningTrades.toString(),
      icon: TrendingUp,
      color: "text-emerald-400"
    },
    {
      label: "Losing Trades",
      value: metrics.losingTrades.toString(),
      icon: TrendingDown,
      color: "text-red-400"
    },
    {
      label: "Avg Win",
      value: formatCurrency(metrics.averageWin),
      icon: DollarSign,
      color: "text-emerald-400"
    },
    {
      label: "Avg Loss",
      value: formatCurrency(metrics.averageLoss),
      icon: DollarSign,
      color: "text-red-400"
    },
    {
      label: "Win Rate",
      value: `${metrics.winRate.toFixed(1)}%`,
      icon: Percent,
      color: metrics.winRate >= 50 ? "text-emerald-400" : "text-red-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Trade Journal</h1>
        <p className="text-sm text-slate-400">
          Review and annotate your trading history
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className={`mt-1 text-xl font-bold ${stat.color}`}>
                {isLoading ? "..." : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trade Table */}
      <TradeTable />
    </div>
  );
}

