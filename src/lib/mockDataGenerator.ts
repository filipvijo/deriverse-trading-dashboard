// ============================================
// DERIVERSE - MOCK DATA GENERATOR
// Generates mathematically consistent trading data
// ============================================

import {
  Trade,
  Position,
  SummaryMetrics,
  DailyPerformance,
  RiskMetrics,
  CalendarDay,
  Symbol,
  TradeType,
  TradeStatus
} from '@/types';
import { generateId, getDateKey } from './utils';

const SYMBOLS: Symbol[] = ['SOL-PERP', 'JUP-PERP', 'BONK-PERP', 'WIF-PERP', 'PYTH-PERP'];

const SYMBOL_PRICES: Record<Symbol, { base: number; volatility: number }> = {
  'SOL-PERP': { base: 148.50, volatility: 0.08 },
  'JUP-PERP': { base: 0.82, volatility: 0.12 },
  'BONK-PERP': { base: 0.000028, volatility: 0.25 },
  'WIF-PERP': { base: 2.15, volatility: 0.18 },
  'PYTH-PERP': { base: 0.38, volatility: 0.15 }
};

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrade(index: number, baseTime: Date): Trade {
  const symbol = randomChoice(SYMBOLS);
  const symbolData = SYMBOL_PRICES[symbol];
  const type: TradeType = Math.random() > 0.45 ? 'LONG' : 'SHORT';
  const leverage = randomChoice([1, 2, 3, 5, 10, 20]);
  const size = randomInRange(100, 5000);
  
  // Generate realistic price movements
  const priceMove = (Math.random() - 0.45) * symbolData.volatility;
  const entryPrice = symbolData.base * (1 + randomInRange(-0.1, 0.1));
  const exitPrice = entryPrice * (1 + priceMove * (type === 'LONG' ? 1 : -1));
  
  // Calculate PnL: (exitPrice - entryPrice) / entryPrice * size * leverage * direction
  const direction = type === 'LONG' ? 1 : -1;
  const pnl = ((exitPrice - entryPrice) / entryPrice) * size * leverage * direction;
  const pnlPercentage = (pnl / size) * 100;
  
  // Trading fees (0.05% - 0.1% of volume)
  const fees = size * leverage * randomInRange(0.0005, 0.001);
  
  // Duration between 5 minutes and 7 days
  const duration = randomInRange(5 * 60 * 1000, 7 * 24 * 60 * 60 * 1000);
  const entryTime = new Date(baseTime.getTime() - (90 - index) * 24 * 60 * 60 * 1000);
  const exitTime = new Date(entryTime.getTime() + duration);

  return {
    id: generateId(),
    symbol,
    type,
    status: 'CLOSED' as TradeStatus,
    entryPrice,
    exitPrice,
    size,
    leverage,
    pnl: pnl - fees, // Net PnL after fees
    pnlPercentage,
    fees,
    entryTime,
    exitTime,
    duration
  };
}

export function generateTrades(count: number = 150): Trade[] {
  const baseTime = new Date();
  return Array.from({ length: count }, (_, i) => generateTrade(i, baseTime))
    .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
}

export function calculateMetrics(trades: Trade[]): SummaryMetrics {
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const winningTrades = closedTrades.filter(t => t.pnl > 0);
  const losingTrades = closedTrades.filter(t => t.pnl <= 0);
  
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  const totalPnl = grossProfit - grossLoss;
  const totalVolume = closedTrades.reduce((sum, t) => sum + t.size * t.leverage, 0);
  const totalFees = closedTrades.reduce((sum, t) => sum + t.fees, 0);
  
  const winRate = closedTrades.length > 0 
    ? (winningTrades.length / closedTrades.length) * 100 
    : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
  
  const avgWin = winningTrades.length > 0 
    ? grossProfit / winningTrades.length 
    : 0;
  const avgLoss = losingTrades.length > 0 
    ? grossLoss / losingTrades.length 
    : 0;

  const longTrades = closedTrades.filter(t => t.type === 'LONG').length;
  const shortTrades = closedTrades.filter(t => t.type === 'SHORT').length;
  
  const avgDuration = closedTrades.length > 0
    ? closedTrades.reduce((sum, t) => sum + t.duration, 0) / closedTrades.length
    : 0;

  const expectancy = (winRate / 100 * avgWin) - ((100 - winRate) / 100 * avgLoss);

  return {
    totalPnl,
    totalPnlPercentage: (totalPnl / totalVolume) * 100,
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    profitFactor,
    grossProfit,
    grossLoss,
    averageWin: avgWin,
    averageLoss: avgLoss,
    largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
    largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
    averageTradeDuration: avgDuration,
    totalVolume,
    totalFees,
    longTrades,
    shortTrades,
    expectancy
  };
}

export function calculateDailyPerformance(trades: Trade[]): DailyPerformance[] {
  const dailyMap = new Map<string, { pnl: number; trades: number; volume: number; fees: number }>();

  trades.forEach(trade => {
    const dateKey = getDateKey(trade.entryTime);
    const existing = dailyMap.get(dateKey) || { pnl: 0, trades: 0, volume: 0, fees: 0 };
    dailyMap.set(dateKey, {
      pnl: existing.pnl + trade.pnl,
      trades: existing.trades + 1,
      volume: existing.volume + trade.size * trade.leverage,
      fees: existing.fees + trade.fees
    });
  });

  const sortedDays = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b));

  let cumulativePnl = 0;
  let highWaterMark = 0;

  return sortedDays.map(([date, data]) => {
    cumulativePnl += data.pnl;
    highWaterMark = Math.max(highWaterMark, cumulativePnl);
    const drawdown = highWaterMark - cumulativePnl;

    return {
      date,
      pnl: data.pnl,
      trades: data.trades,
      volume: data.volume,
      fees: data.fees,
      cumulativePnl,
      drawdown,
      highWaterMark
    };
  });
}

export function calculateRiskMetrics(trades: Trade[], metrics: SummaryMetrics): RiskMetrics {
  const dailyPerf = calculateDailyPerformance(trades);

  let maxDrawdown = 0;
  let maxDrawdownPct = 0;
  let currentDrawdown = 0;
  let highWaterMark = 0;

  dailyPerf.forEach(day => {
    highWaterMark = Math.max(highWaterMark, day.cumulativePnl);
    currentDrawdown = highWaterMark - day.cumulativePnl;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      maxDrawdownPct = highWaterMark > 0 ? (currentDrawdown / highWaterMark) * 100 : 0;
    }
  });

  // Calculate consecutive losses
  let consecutiveLosses = 0;
  let maxConsecutiveLosses = 0;
  trades.forEach(trade => {
    if (trade.pnl < 0) {
      consecutiveLosses++;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
    } else {
      consecutiveLosses = 0;
    }
  });

  // Simplified Sharpe Ratio calculation
  const returns = dailyPerf.map(d => d.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  // Risk of Ruin calculation
  const winRate = metrics.winRate / 100;
  const avgWin = metrics.averageWin;
  const avgLoss = metrics.averageLoss;
  const riskOfRuin = calculateSimpleRoR(winRate, avgWin, avgLoss);

  return {
    riskOfRuin,
    maxDrawdown,
    maxDrawdownPercentage: maxDrawdownPct,
    sharpeRatio,
    sortinoRatio: sharpeRatio * 1.2, // Simplified
    calmarRatio: maxDrawdown > 0 ? (metrics.totalPnl / maxDrawdown) : 0,
    averageRisk: 2.5, // Mock average risk per trade
    currentDrawdown,
    currentDrawdownPercentage: highWaterMark > 0 ? (currentDrawdown / highWaterMark) * 100 : 0,
    consecutiveLosses,
    maxConsecutiveLosses
  };
}

function calculateSimpleRoR(winRate: number, avgWin: number, avgLoss: number): number {
  if (avgLoss === 0) return 0;
  const edgeRatio = (winRate * avgWin) / ((1 - winRate) * avgLoss);
  if (edgeRatio <= 1) return 95;
  return Math.max(0, Math.min(100, 100 / Math.pow(edgeRatio, 2)));
}

export function generateCalendarData(trades: Trade[]): CalendarDay[] {
  const dailyMap = new Map<string, { pnl: number; trades: number }>();

  trades.forEach(trade => {
    const dateKey = getDateKey(trade.entryTime);
    const existing = dailyMap.get(dateKey) || { pnl: 0, trades: 0 };
    dailyMap.set(dateKey, {
      pnl: existing.pnl + trade.pnl,
      trades: existing.trades + 1
    });
  });

  const maxPnl = Math.max(...Array.from(dailyMap.values()).map(d => Math.abs(d.pnl)));

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    pnl: data.pnl,
    trades: data.trades,
    isProfit: data.pnl >= 0,
    intensity: Math.min(4, Math.floor((Math.abs(data.pnl) / maxPnl) * 5))
  }));
}

export function generatePositions(): Position[] {
  return SYMBOLS.slice(0, 3).map(symbol => {
    const symbolData = SYMBOL_PRICES[symbol];
    const type: TradeType = Math.random() > 0.5 ? 'LONG' : 'SHORT';
    const entryPrice = symbolData.base * (1 + randomInRange(-0.05, 0.05));
    const currentPrice = entryPrice * (1 + randomInRange(-0.1, 0.1));
    const size = randomInRange(500, 3000);
    const leverage = randomChoice([2, 5, 10]);
    const direction = type === 'LONG' ? 1 : -1;
    const unrealizedPnl = ((currentPrice - entryPrice) / entryPrice) * size * leverage * direction;

    return {
      id: generateId(),
      symbol,
      type,
      entryPrice,
      currentPrice,
      size,
      leverage,
      unrealizedPnl,
      unrealizedPnlPercentage: (unrealizedPnl / size) * 100,
      liquidationPrice: entryPrice * (1 - (direction * 0.9 / leverage)),
      margin: size / leverage,
      entryTime: new Date(Date.now() - randomInRange(1, 48) * 60 * 60 * 1000)
    };
  });
}

