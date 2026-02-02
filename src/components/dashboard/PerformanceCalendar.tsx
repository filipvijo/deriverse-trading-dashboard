"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency, cn } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay, subMonths } from "date-fns";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getIntensityClass(pnl: number, maxPnl: number): string {
  const normalizedIntensity = Math.abs(pnl) / maxPnl;
  
  if (pnl > 0) {
    if (normalizedIntensity > 0.75) return "bg-emerald-500";
    if (normalizedIntensity > 0.5) return "bg-emerald-400/80";
    if (normalizedIntensity > 0.25) return "bg-emerald-400/50";
    return "bg-emerald-400/30";
  } else if (pnl < 0) {
    if (normalizedIntensity > 0.75) return "bg-red-500";
    if (normalizedIntensity > 0.5) return "bg-red-400/80";
    if (normalizedIntensity > 0.25) return "bg-red-400/50";
    return "bg-red-400/30";
  }
  return "bg-slate-800";
}

export function PerformanceCalendar() {
  const { calendarData, isLoading } = useTradeStore();

  const { weeks, maxPnl, monthLabel, stats } = useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);
    const allDays = eachDayOfInterval({ start: threeMonthsAgo, end: today });
    
    const pnlMap = new Map<string, { pnl: number; trades: number }>();
    calendarData.forEach(day => {
      pnlMap.set(day.date, { pnl: day.pnl, trades: day.trades });
    });

    const maxPnl = Math.max(
      1,
      ...calendarData.map(d => Math.abs(d.pnl))
    );

    // Group into weeks
    const weeks: { date: Date; pnl: number; trades: number }[][] = [];
    let currentWeek: { date: Date; pnl: number; trades: number }[] = [];

    // Add empty cells for days before the start
    const startDayOfWeek = getDay(allDays[0]);
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: new Date(0), pnl: 0, trades: 0 });
    }

    allDays.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      const data = pnlMap.get(dateKey) || { pnl: 0, trades: 0 };
      currentWeek.push({ date: day, pnl: data.pnl, trades: data.trades });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Calculate stats
    const profitDays = calendarData.filter(d => d.pnl > 0).length;
    const lossDays = calendarData.filter(d => d.pnl < 0).length;
    const totalPnl = calendarData.reduce((sum, d) => sum + d.pnl, 0);

    return {
      weeks,
      maxPnl,
      monthLabel: format(today, "MMMM yyyy"),
      stats: { profitDays, lossDays, totalPnl }
    };
  }, [calendarData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            Performance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Performance Calendar
            </CardTitle>
            <CardDescription>Last 90 days trading activity</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-slate-400">{stats.profitDays} profit days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="h-3 w-3 text-red-400" />
              <span className="text-slate-400">{stats.lossDays} loss days</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            {/* Day labels */}
            <div className="flex gap-1 mb-1">
              <div className="w-8" />
              {DAYS.map(day => (
                <div key={day} className="w-4 text-center text-[10px] text-slate-500">
                  {day[0]}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    if (day.date.getTime() === 0) {
                      return <div key={dayIdx} className="h-4 w-4" />;
                    }
                    
                    return (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              "h-4 w-4 rounded-sm transition-all hover:ring-2 hover:ring-slate-600",
                              day.trades > 0 
                                ? getIntensityClass(day.pnl, maxPnl)
                                : "bg-slate-800/50"
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{format(day.date, "MMM d, yyyy")}</p>
                            {day.trades > 0 ? (
                              <>
                                <p className={day.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                                  {formatCurrency(day.pnl)}
                                </p>
                                <p className="text-slate-400">{day.trades} trades</p>
                              </>
                            ) : (
                              <p className="text-slate-400">No trades</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

