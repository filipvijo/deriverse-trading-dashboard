import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Trade,
  Position,
  SummaryMetrics,
  DailyPerformance,
  RiskMetrics,
  CalendarDay
} from '@/types';
import {
  generateTrades,
  generatePositions,
  calculateMetrics,
  calculateDailyPerformance,
  calculateRiskMetrics,
  generateCalendarData
} from '@/lib/mockDataGenerator';

export type DateRange = '7d' | '30d' | '90d' | 'all';
export type SymbolFilter = string | 'all';
export type DataSource = 'mock' | 'wallet';

interface TradeStore {
  // Raw data
  allTrades: Trade[];
  positions: Position[];
  annotations: Record<string, string>;
  isLoading: boolean;
  isInitialized: boolean;

  // Wallet integration
  dataSource: DataSource;
  walletAddress: string | null;

  // Filters
  dateRange: DateRange;
  symbolFilter: SymbolFilter;

  // Filtered/computed data
  trades: Trade[];
  metrics: SummaryMetrics;
  dailyPerformance: DailyPerformance[];
  riskMetrics: RiskMetrics;
  calendarData: CalendarDay[];
  availableSymbols: string[];

  // Actions
  setTrades: (trades: Trade[]) => void;
  setPositions: (positions: Position[]) => void;
  updateAnnotation: (tradeId: string, annotation: string) => void;
  refreshData: () => void;
  initializeData: () => void;
  setDateRange: (range: DateRange) => void;
  setSymbolFilter: (symbol: SymbolFilter) => void;
  setDataSource: (source: DataSource) => void;
  setWalletTrades: (trades: Trade[], walletAddress: string) => void;
  disconnectWallet: () => void;
}

const createEmptyMetrics = (): SummaryMetrics => ({
  totalPnl: 0,
  totalPnlPercentage: 0,
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
  winRate: 0,
  profitFactor: 0,
  grossProfit: 0,
  grossLoss: 0,
  averageWin: 0,
  averageLoss: 0,
  largestWin: 0,
  largestLoss: 0,
  averageTradeDuration: 0,
  totalVolume: 0,
  totalFees: 0,
  longTrades: 0,
  shortTrades: 0,
  expectancy: 0
});

const createEmptyRiskMetrics = (): RiskMetrics => ({
  riskOfRuin: 0,
  maxDrawdown: 0,
  maxDrawdownPercentage: 0,
  sharpeRatio: 0,
  sortinoRatio: 0,
  calmarRatio: 0,
  averageRisk: 0,
  currentDrawdown: 0,
  currentDrawdownPercentage: 0,
  consecutiveLosses: 0,
  maxConsecutiveLosses: 0
});

// Helper to filter trades by date range
const filterTradesByDate = (trades: Trade[], range: DateRange): Trade[] => {
  if (range === 'all') return trades;

  const now = new Date();
  const daysMap: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90, 'all': 0 };
  const days = daysMap[range];
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return trades.filter(t => t.entryTime >= cutoff);
};

// Helper to filter trades by symbol
const filterTradesBySymbol = (trades: Trade[], symbol: SymbolFilter): Trade[] => {
  if (symbol === 'all') return trades;
  return trades.filter(t => t.symbol === symbol);
};

// Apply all filters and recalculate metrics
const applyFilters = (
  allTrades: Trade[],
  dateRange: DateRange,
  symbolFilter: SymbolFilter
) => {
  let filtered = filterTradesByDate(allTrades, dateRange);
  filtered = filterTradesBySymbol(filtered, symbolFilter);

  const metrics = calculateMetrics(filtered);
  const dailyPerformance = calculateDailyPerformance(filtered);
  const riskMetrics = calculateRiskMetrics(filtered, metrics);
  const calendarData = generateCalendarData(filtered);

  return { trades: filtered, metrics, dailyPerformance, riskMetrics, calendarData };
};

// Extract unique symbols from trades
const getAvailableSymbols = (trades: Trade[]): string[] => {
  return Array.from(new Set(trades.map(t => t.symbol))).sort();
};

export const useTradeStore = create<TradeStore>()(
  persist(
    (set, get) => ({
      allTrades: [],
      trades: [],
      positions: [],
      metrics: createEmptyMetrics(),
      dailyPerformance: [],
      riskMetrics: createEmptyRiskMetrics(),
      calendarData: [],
      annotations: {},
      isLoading: false,
      isInitialized: false,
      dataSource: 'mock',
      walletAddress: null,
      dateRange: 'all',
      symbolFilter: 'all',
      availableSymbols: [],

      setTrades: (trades) => {
        const { dateRange, symbolFilter } = get();
        const computed = applyFilters(trades, dateRange, symbolFilter);
        const availableSymbols = getAvailableSymbols(trades);

        set({ allTrades: trades, availableSymbols, ...computed });
      },

      setPositions: (positions) => set({ positions }),

      updateAnnotation: (tradeId, annotation) => {
        const annotations = { ...get().annotations, [tradeId]: annotation };
        set({ annotations });
      },

      setDateRange: (range) => {
        const { allTrades, symbolFilter } = get();
        const computed = applyFilters(allTrades, range, symbolFilter);
        set({ dateRange: range, ...computed });
      },

      setSymbolFilter: (symbol) => {
        const { allTrades, dateRange } = get();
        const computed = applyFilters(allTrades, dateRange, symbol);
        set({ symbolFilter: symbol, ...computed });
      },

      refreshData: () => {
        set({ isLoading: true });

        setTimeout(() => {
          const allTrades = generateTrades(150);
          const positions = generatePositions();
          const availableSymbols = getAvailableSymbols(allTrades);
          const { dateRange, symbolFilter } = get();
          const computed = applyFilters(allTrades, dateRange, symbolFilter);

          set({
            allTrades,
            positions,
            availableSymbols,
            ...computed,
            isLoading: false,
            isInitialized: true
          });
        }, 500);
      },

      setDataSource: (source) => {
        set({ dataSource: source });
        if (source === 'mock') {
          get().refreshData();
        }
      },

      setWalletTrades: (trades, walletAddress) => {
        const { dateRange, symbolFilter } = get();
        const computed = applyFilters(trades, dateRange, symbolFilter);
        const availableSymbols = getAvailableSymbols(trades);

        set({
          allTrades: trades,
          availableSymbols,
          ...computed,
          dataSource: 'wallet',
          walletAddress,
          isLoading: false,
          isInitialized: true
        });
      },

      disconnectWallet: () => {
        set({ dataSource: 'mock', walletAddress: null });
        get().refreshData();
      },

      initializeData: () => {
        const { isInitialized } = get();
        if (!isInitialized) {
          get().refreshData();
        }
      }
    }),
    {
      name: 'deriverse-trade-storage',
      partialize: (state) => ({
        annotations: state.annotations,
        dataSource: state.dataSource
      })
    }
  )
);

