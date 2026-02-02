import { NextRequest, NextResponse } from "next/server";

interface TradeData {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  pnl: number;
  pnlPercentage: number;
  size: number;
  leverage: number;
  entryTime: string;
  exitTime: string;
  duration: number;
}

interface AnalysisRequest {
  trades: TradeData[];
}

interface PatternAnalysis {
  weaknesses: string[];
  timestamp: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalysisRequest = await request.json();
    const { trades } = body;

    if (!trades || trades.length === 0) {
      return NextResponse.json(
        { error: "No trades provided for analysis" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return mock analysis if no API key is configured
      return NextResponse.json({
        weaknesses: [
          "🎯 Revenge trading pattern detected: Multiple rapid trades after losses, especially on Tuesdays and Wednesdays",
          "⚡ Overleverage tendency: Using 10x+ leverage on 40% of losing trades, suggesting emotional decision-making",
          "🕐 Poor timing discipline: 65% of losses occur in the first hour of trading sessions, indicating FOMO entries"
        ],
        timestamp: new Date().toISOString(),
        isMock: true
      } as PatternAnalysis & { isMock: boolean });
    }

    // Prepare trade summary for the LLM
    const tradeSummary = trades.slice(0, 50).map((trade) => ({
      symbol: trade.symbol,
      type: trade.type,
      pnl: trade.pnl.toFixed(2),
      pnlPercent: trade.pnlPercentage.toFixed(2) + "%",
      size: trade.size,
      leverage: trade.leverage + "x",
      dayOfWeek: new Date(trade.entryTime).toLocaleDateString("en-US", { weekday: "long" }),
      hour: new Date(trade.entryTime).getHours(),
      durationMins: Math.round(trade.duration / 60000),
      result: trade.pnl >= 0 ? "WIN" : "LOSS"
    }));

    const prompt = `You are an expert trading psychologist analyzing a trader's recent performance data. 
Analyze the following 50 trades and identify exactly 3 psychological weaknesses or behavioral patterns that may be hurting their performance.

Focus on patterns like:
- Revenge trading (rapid trades after losses)
- Overtrading on specific days/times
- Emotional leverage decisions
- FOMO entries
- Holding losers too long
- Cutting winners too short
- Time-of-day patterns
- Symbol-specific biases

Trade Data:
${JSON.stringify(tradeSummary, null, 2)}

Respond with EXACTLY 3 bullet points. Each bullet should:
1. Start with a relevant emoji
2. Name the specific pattern detected
3. Include specific data points (days, percentages, times) from the analysis
4. Be actionable and specific

Format your response as a JSON array of 3 strings, like:
["🎯 Pattern 1...", "⚡ Pattern 2...", "🕐 Pattern 3..."]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a trading psychology expert. Always respond with valid JSON arrays only."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    // Parse the JSON array from the response
    let weaknesses: string[];
    try {
      weaknesses = JSON.parse(content);
      if (!Array.isArray(weaknesses) || weaknesses.length !== 3) {
        throw new Error("Invalid response format");
      }
    } catch {
      // If parsing fails, try to extract bullet points
      weaknesses = content
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3);
    }

    return NextResponse.json({
      weaknesses,
      timestamp: new Date().toISOString()
    } as PatternAnalysis);

  } catch (error) {
    console.error("Pattern analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze trading patterns" },
      { status: 500 }
    );
  }
}

