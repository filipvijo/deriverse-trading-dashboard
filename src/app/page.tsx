"use client";

import { KPICards } from "@/components/dashboard/KPICards";
import { CumulativePnLChart } from "@/components/charts/CumulativePnLChart";
import { VolumeFeesChart } from "@/components/charts/VolumeFeesChart";
import { WinLossDistribution } from "@/components/charts/WinLossDistribution";
import { LongShortRatio } from "@/components/charts/LongShortRatio";
import { RiskAnalysis } from "@/components/dashboard/RiskAnalysis";
import { PerformanceCalendar } from "@/components/dashboard/PerformanceCalendar";
import { PatternRecognition } from "@/components/dashboard/PatternRecognition";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

export default function DashboardPage() {
  const { metrics, isLoading } = useTradeStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Your trading performance at a glance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-4 py-2 border border-slate-800">
            <Wallet className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Portfolio Value:</span>
            <span className="font-mono font-bold text-cyan-400">
              {isLoading ? "..." : formatCurrency(50000 + metrics.totalPnl)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* KPI Cards */}
      <KPICards />

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CumulativePnLChart />
        </div>
        <div>
          <LongShortRatio />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <VolumeFeesChart />
        <WinLossDistribution />
      </div>

      {/* Risk & Calendar Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiskAnalysis />
        <PerformanceCalendar />
      </div>

      {/* AI Pattern Recognition */}
      <PatternRecognition />
    </div>
  );
}
