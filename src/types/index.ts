// ============================================
// DERIVERSE TRADING ANALYTICS - TYPE DEFINITIONS
// ============================================

export type TradeType = 'LONG' | 'SHORT';
export type TradeStatus = 'OPEN' | 'CLOSED' | 'LIQUIDATED';
export type Symbol = 'SOL-PERP' | 'JUP-PERP' | 'BONK-PERP' | 'WIF-PERP' | 'PYTH-PERP';

export interface Trade {
  id: string;
  symbol: Symbol;
  type: TradeType;
  status: TradeStatus;
  entryPrice: number;
  exitPrice: number | null;
  size: number; // Position size in USD
  leverage: number;
  pnl: number; // Realized PnL = (exitPrice - entryPrice) * size * direction
  pnlPercentage: number;
  fees: number; // Trading fees paid
  entryTime: Date;
  exitTime: Date | null;
  duration: number; // Duration in milliseconds
  annotation?: string; // User notes
}

export interface Position {
  id: string;
  symbol: Symbol;
  type: TradeType;
  entryPrice: number;
  currentPrice: number;
  size: number;
  leverage: number;
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  liquidationPrice: number;
  margin: number;
  entryTime: Date;
}

export interface SummaryMetrics {
  totalPnl: number;
  totalPnlPercentage: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number; // winningTrades / totalTrades * 100
  profitFactor: number; // grossProfit / grossLoss
  grossProfit: number;
  grossLoss: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageTradeDuration: number; // in milliseconds
  totalVolume: number;
  totalFees: number;
  longTrades: number;
  shortTrades: number;
  expectancy: number; // (winRate * avgWin) - (lossRate * avgLoss)
}

export interface DailyPerformance {
  date: string; // YYYY-MM-DD
  pnl: number;
  trades: number;
  volume: number;
  fees: number;
  cumulativePnl: number;
  drawdown: number;
  highWaterMark: number;
}

export interface RiskMetrics {
  riskOfRuin: number; // Probability of losing entire capital
  maxDrawdown: number;
  maxDrawdownPercentage: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  averageRisk: number; // Average position size as % of portfolio
  currentDrawdown: number;
  currentDrawdownPercentage: number;
  consecutiveLosses: number;
  maxConsecutiveLosses: number;
}

export interface ChartDataPoint {
  date: string;
  timestamp: number;
  value: number;
  pnl?: number;
  cumulativePnl?: number;
  drawdown?: number;
  volume?: number;
  fees?: number;
}

export interface CalendarDay {
  date: string;
  pnl: number;
  trades: number;
  isProfit: boolean;
  intensity: number; // 0-4 for heatmap intensity
}

export interface TradeStore {
  trades: Trade[];
  positions: Position[];
  metrics: SummaryMetrics;
  dailyPerformance: DailyPerformance[];
  riskMetrics: RiskMetrics;
  annotations: Record<string, string>;
  isLoading: boolean;
  setTrades: (trades: Trade[]) => void;
  setPositions: (positions: Position[]) => void;
  updateAnnotation: (tradeId: string, annotation: string) => void;
  refreshData: () => void;
}

