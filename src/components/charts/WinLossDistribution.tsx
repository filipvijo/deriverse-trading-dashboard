"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency } from "@/lib/utils";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis
} from "recharts";
import { Target } from "lucide-react";

export function WinLossDistribution() {
  const { trades, isLoading } = useTradeStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-400" />
            Trade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const winningTrades = trades
    .filter(t => t.pnl > 0)
    .map((t, i) => ({
      x: i + 1,
      y: t.pnl,
      size: t.size,
      symbol: t.symbol,
      type: t.type
    }));

  const losingTrades = trades
    .filter(t => t.pnl <= 0)
    .map((t, i) => ({
      x: i + 1,
      y: t.pnl,
      size: t.size,
      symbol: t.symbol,
      type: t.type
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Target className="h-5 w-5 text-cyan-400" />
            Trade Distribution
          </CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Wins ({winningTrades.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-slate-400">Losses ({losingTrades.length})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="x"
                name="Trade #"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="PnL"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, 0)}
              />
              <ZAxis type="number" dataKey="size" range={[50, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                }}
                formatter={(value, name) => [
                  name === "y" ? formatCurrency(Number(value) || 0) : value,
                  name === "y" ? "PnL" : name === "x" ? "Trade #" : "Size"
                ]}
              />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
              <Scatter
                name="Wins"
                data={winningTrades}
                fill="#34d399"
                fillOpacity={0.7}
              />
              <Scatter
                name="Losses"
                data={losingTrades}
                fill="#f87171"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

