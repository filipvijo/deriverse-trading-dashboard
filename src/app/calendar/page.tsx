"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PerformanceCalendar } from "@/components/dashboard/PerformanceCalendar";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function CalendarPage() {
  const { calendarData, dailyPerformance, isLoading } = useTradeStore();

  const monthlyStats = useMemo(() => {
    const monthlyMap = new Map<string, { pnl: number; trades: number; profitDays: number; lossDays: number }>();
    
    calendarData.forEach(day => {
      const monthKey = day.date.substring(0, 7); // YYYY-MM
      const existing = monthlyMap.get(monthKey) || { pnl: 0, trades: 0, profitDays: 0, lossDays: 0 };
      monthlyMap.set(monthKey, {
        pnl: existing.pnl + day.pnl,
        trades: existing.trades + day.trades,
        profitDays: existing.profitDays + (day.pnl > 0 ? 1 : 0),
        lossDays: existing.lossDays + (day.pnl < 0 ? 1 : 0)
      });
    });

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        ...data
      }));
  }, [calendarData]);

  const streakStats = useMemo(() => {
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    
    const sortedDays = [...calendarData].sort((a, b) => a.date.localeCompare(b.date));
    
    sortedDays.forEach(day => {
      if (day.pnl > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (day.pnl < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    });

    return { currentWinStreak, currentLossStreak, maxWinStreak, maxLossStreak };
  }, [calendarData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Performance Calendar</h1>
        <p className="text-sm text-slate-400">
          Track your daily and monthly trading performance
        </p>
      </div>

      {/* Calendar Component */}
      <PerformanceCalendar />

      {/* Streak Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Max Win Streak</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {isLoading ? "..." : `${streakStats.maxWinStreak} days`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-xs text-slate-400">Max Loss Streak</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-red-400">
              {isLoading ? "..." : `${streakStats.maxLossStreak} days`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Current Win Streak</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-cyan-400">
              {isLoading ? "..." : `${streakStats.currentWinStreak} days`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Trading Days</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-200">
              {isLoading ? "..." : calendarData.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-cyan-400" />
            Monthly Performance
          </CardTitle>
          <CardDescription>Breakdown by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase text-slate-400">Month</th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase text-slate-400">PnL</th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase text-slate-400">Trades</th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase text-slate-400">Profit Days</th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase text-slate-400">Loss Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {monthlyStats.map((month) => (
                  <tr key={month.month} className="hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-medium text-slate-200">{month.month}</td>
                    <td className={`py-3 px-4 text-right font-mono ${month.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(month.pnl)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">{month.trades}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">{month.profitDays}</td>
                    <td className="py-3 px-4 text-right text-red-400">{month.lossDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

