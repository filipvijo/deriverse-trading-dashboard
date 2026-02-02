"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  BarChart2,
  Activity,
  Zap
} from "lucide-react";

function RiskMeter({ value, label }: { value: number; label: string }) {
  const getRiskColor = (val: number) => {
    if (val <= 20) return "bg-emerald-500";
    if (val <= 40) return "bg-emerald-400";
    if (val <= 60) return "bg-amber-400";
    if (val <= 80) return "bg-orange-500";
    return "bg-red-500";
  };

  const getRiskLevel = (val: number) => {
    if (val <= 20) return { text: "Very Low", variant: "success" as const };
    if (val <= 40) return { text: "Low", variant: "success" as const };
    if (val <= 60) return { text: "Moderate", variant: "warning" as const };
    if (val <= 80) return { text: "High", variant: "destructive" as const };
    return { text: "Critical", variant: "destructive" as const };
  };

  const risk = getRiskLevel(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <Badge variant={risk.variant}>{risk.text}</Badge>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full transition-all duration-500", getRiskColor(value))}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <p className="text-right text-xs text-slate-500">{value.toFixed(1)}%</p>
    </div>
  );
}

export function RiskAnalysis() {
  const { riskMetrics, metrics, isLoading } = useTradeStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Max Drawdown",
      value: formatCurrency(riskMetrics.maxDrawdown),
      subValue: formatPercentage(-riskMetrics.maxDrawdownPercentage),
      icon: TrendingDown,
      color: "text-red-400"
    },
    {
      label: "Sharpe Ratio",
      value: riskMetrics.sharpeRatio.toFixed(2),
      subValue: riskMetrics.sharpeRatio >= 1 ? "Good" : "Needs work",
      icon: BarChart2,
      color: riskMetrics.sharpeRatio >= 1 ? "text-emerald-400" : "text-amber-400"
    },
    {
      label: "Expectancy",
      value: formatCurrency(metrics.expectancy),
      subValue: "Per trade avg",
      icon: Activity,
      color: metrics.expectancy >= 0 ? "text-emerald-400" : "text-red-400"
    },
    {
      label: "Max Consecutive Losses",
      value: riskMetrics.maxConsecutiveLosses.toString(),
      subValue: `Current: ${riskMetrics.consecutiveLosses}`,
      icon: Zap,
      color: "text-amber-400"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Shield className="h-5 w-5 text-cyan-400" />
          Risk Analysis
        </CardTitle>
        <CardDescription>
          Advanced risk metrics based on your trading history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk of Ruin Section */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h4 className="font-medium text-slate-200">Risk of Ruin Analysis</h4>
          </div>
          <RiskMeter value={riskMetrics.riskOfRuin} label="Probability of Account Ruin" />
          <p className="mt-3 text-xs text-slate-500">
            Based on current win rate ({metrics.winRate.toFixed(1)}%) and average risk per trade.
            Lower is better. Keep below 5% for safety.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-800 bg-slate-900/30 p-3"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className={cn("mt-1 text-lg font-bold", stat.color)}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.subValue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

