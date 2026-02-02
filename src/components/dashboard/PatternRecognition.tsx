"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/store/tradeStore";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface PatternAnalysis {
  weaknesses: string[];
  timestamp: string;
  isMock?: boolean;
}

export function PatternRecognition() {
  const { trades } = useTradeStore();
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePatterns = async () => {
    if (trades.length === 0) {
      setError("No trades available for analysis");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare trade data for the API
      const tradeData = trades.slice(0, 50).map((trade) => ({
        id: trade.id,
        symbol: trade.symbol,
        type: trade.type,
        pnl: trade.pnl,
        pnlPercentage: trade.pnlPercentage,
        size: trade.size,
        leverage: trade.leverage,
        entryTime: trade.entryTime.toISOString(),
        exitTime: trade.exitTime?.toISOString() || "",
        duration: trade.duration
      }));

      const response = await fetch("/api/analyze-patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trades: tradeData })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze patterns");
      }

      const data: PatternAnalysis = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-cyan-900/50 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Brain className="h-5 w-5 text-purple-400" />
          AI Pattern Recognition
          <Sparkles className="h-4 w-4 text-amber-400" />
        </CardTitle>
        <CardDescription>
          Analyze your last 50 trades for psychological patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Button */}
        <Button
          onClick={analyzePatterns}
          disabled={isLoading || trades.length === 0}
          className={cn(
            "w-full gap-2 bg-gradient-to-r from-purple-600 to-cyan-600",
            "hover:from-purple-500 hover:to-cyan-500",
            "disabled:from-slate-700 disabled:to-slate-700"
          )}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing Patterns...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Analyze Trading Psychology
            </>
          )}
        </Button>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {analysis && !isLoading && (
          <div className="space-y-3">
            {analysis.isMock && (
              <p className="text-xs text-amber-400/70">
                ⚠️ Demo mode - Add OPENAI_API_KEY for real analysis
              </p>
            )}
            {analysis.weaknesses.map((weakness, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border border-slate-800 bg-slate-900/70 p-4",
                  "transition-all duration-300 hover:border-purple-800/50",
                  "animate-in fade-in slide-in-from-bottom-2"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-sm leading-relaxed text-slate-300">
                  {weakness}
                </p>
              </div>
            ))}
            <p className="text-right text-xs text-slate-500">
              Analyzed at {new Date(analysis.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !isLoading && !error && (
          <p className="text-center text-sm text-slate-500">
            Click the button above to analyze your trading patterns
          </p>
        )}
      </CardContent>
    </Card>
  );
}

