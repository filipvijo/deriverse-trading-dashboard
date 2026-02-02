"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, formatPercentage, formatDuration } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Scale,
  Clock,
  Activity,
  Percent,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
}

function KPICard({ title, value, subtitle, icon, trend, trendValue, isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group hover:border-slate-700 transition-all">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className={cn(
              "text-2xl font-bold tracking-tight",
              trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-100"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
            {trendValue && (
              <div className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400"
              )}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                {trendValue}
              </div>
            )}
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            trend === "up" 
              ? "bg-emerald-500/10 text-emerald-400" 
              : trend === "down" 
                ? "bg-red-500/10 text-red-400" 
                : "bg-cyan-500/10 text-cyan-400"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const { metrics, isLoading } = useTradeStore();

  const cards = [
    {
      title: "Total PnL",
      value: formatCurrency(metrics.totalPnl),
      subtitle: `From ${metrics.totalTrades} trades`,
      icon: <Activity className="h-6 w-6" />,
      trend: metrics.totalPnl >= 0 ? "up" as const : "down" as const,
      trendValue: formatPercentage(metrics.totalPnlPercentage)
    },
    {
      title: "Win Rate",
      value: `${metrics.winRate.toFixed(1)}%`,
      subtitle: `${metrics.winningTrades}W / ${metrics.losingTrades}L`,
      icon: <Target className="h-6 w-6" />,
      trend: metrics.winRate >= 50 ? "up" as const : "down" as const,
      trendValue: `${metrics.winningTrades} winning trades`
    },
    {
      title: "Profit Factor",
      value: metrics.profitFactor === Infinity ? "∞" : metrics.profitFactor.toFixed(2),
      subtitle: "Gross Profit / Gross Loss",
      icon: <Scale className="h-6 w-6" />,
      trend: metrics.profitFactor >= 1.5 ? "up" as const : metrics.profitFactor >= 1 ? "neutral" as const : "down" as const,
      trendValue: `${formatCurrency(metrics.grossProfit)} profit`
    },
    {
      title: "Avg Trade Duration",
      value: formatDuration(metrics.averageTradeDuration),
      subtitle: "Time in position",
      icon: <Clock className="h-6 w-6" />,
      trend: "neutral" as const,
      trendValue: `${metrics.totalTrades} total trades`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}

