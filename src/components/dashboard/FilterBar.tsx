"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTradeStore, DateRange, SymbolFilter } from "@/store/tradeStore";
import { cn } from "@/lib/utils";
import { Calendar, Filter, TrendingUp } from "lucide-react";

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

export function FilterBar() {
  const { dateRange, setDateRange, symbolFilter, setSymbolFilter, availableSymbols, trades, allTrades } = useTradeStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4 overflow-x-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Filter className="h-4 w-4" />
        <span>
          Showing <span className="font-semibold text-cyan-400">{trades.length}</span> of{" "}
          <span className="font-semibold text-slate-300">{allTrades.length}</span> trades
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Date Range Buttons */}
        <div className="flex items-center gap-1 min-w-0">
          <Calendar className="h-4 w-4 text-slate-500 mr-1 shrink-0" />
          <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1 overflow-x-auto">
            {dateRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setDateRange(option.value)}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  dateRange === option.value
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Symbol Filter Dropdown */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <Select
            value={symbolFilter}
            onValueChange={(value) => setSymbolFilter(value as SymbolFilter)}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs border-slate-700 bg-slate-900">
              <SelectValue placeholder="All Symbols" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all" className="text-xs">All Symbols</SelectItem>
              {availableSymbols.map((symbol) => (
                <SelectItem key={symbol} value={symbol} className="text-xs font-mono">
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

