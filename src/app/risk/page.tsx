"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiskAnalysis } from "@/components/dashboard/RiskAnalysis";
import { PatternRecognition } from "@/components/dashboard/PatternRecognition";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Shield, AlertTriangle, TrendingDown, BarChart2, Activity, Zap, Target, Scale } from "lucide-react";

export default function RiskPage() {
  const { metrics, riskMetrics, isLoading } = useTradeStore();

  const riskStats = [
    {
      label: "Current Drawdown",
      value: formatCurrency(riskMetrics.currentDrawdown),
      subValue: formatPercentage(-riskMetrics.currentDrawdownPercentage),
      icon: TrendingDown,
      color: "text-amber-400"
    },
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
      subValue: riskMetrics.sharpeRatio >= 2 ? "Excellent" : riskMetrics.sharpeRatio >= 1 ? "Good" : "Needs Work",
      icon: BarChart2,
      color: riskMetrics.sharpeRatio >= 1 ? "text-emerald-400" : "text-amber-400"
    },
    {
      label: "Sortino Ratio",
      value: riskMetrics.sortinoRatio.toFixed(2),
      subValue: "Downside risk adjusted",
      icon: Activity,
      color: riskMetrics.sortinoRatio >= 1 ? "text-emerald-400" : "text-amber-400"
    },
    {
      label: "Calmar Ratio",
      value: riskMetrics.calmarRatio.toFixed(2),
      subValue: "Return / Max DD",
      icon: Scale,
      color: riskMetrics.calmarRatio >= 1 ? "text-emerald-400" : "text-amber-400"
    },
    {
      label: "Max Consecutive Losses",
      value: riskMetrics.maxConsecutiveLosses.toString(),
      subValue: `Current streak: ${riskMetrics.consecutiveLosses}`,
      icon: Zap,
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Risk Analysis</h1>
        <p className="text-sm text-slate-400">
          Advanced risk metrics and exposure analysis
        </p>
      </div>

      {/* Risk Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {riskStats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {isLoading ? "..." : stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.subValue}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Risk Analysis & Pattern Recognition */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiskAnalysis />
        <PatternRecognition />
      </div>

      {/* Risk Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Risk Management Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <h4 className="font-medium text-slate-200 mb-2">Position Sizing</h4>
              <p className="text-xs text-slate-400">
                Never risk more than 2% of your portfolio on a single trade. Current avg risk: {riskMetrics.averageRisk.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <h4 className="font-medium text-slate-200 mb-2">Win Rate Target</h4>
              <p className="text-xs text-slate-400">
                Aim for a win rate above 50%. Your current win rate: {metrics.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <h4 className="font-medium text-slate-200 mb-2">Profit Factor</h4>
              <p className="text-xs text-slate-400">
                Target a profit factor above 1.5. Your current: {metrics.profitFactor === Infinity ? "∞" : metrics.profitFactor.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

