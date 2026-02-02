import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (absValue >= 1_000) {
    return `$${(value / 1_000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateRiskOfRuin(
  winRate: number,
  avgWin: number,
  avgLoss: number,
  riskPerTrade: number = 0.02
): number {
  // Kelly Criterion based Risk of Ruin calculation
  const lossRate = 1 - winRate;
  const edge = (winRate * avgWin) - (lossRate * avgLoss);
  
  if (edge <= 0) return 100; // Negative expectancy = eventual ruin
  
  const variance = (winRate * avgWin * avgWin) + (lossRate * avgLoss * avgLoss);
  const standardDev = Math.sqrt(variance);
  
  // Simplified Risk of Ruin formula
  const ror = Math.pow((1 - riskPerTrade) / (1 + riskPerTrade), 1 / riskPerTrade);
  const adjustedRor = Math.pow(ror, edge / (standardDev * standardDev)) * 100;
  
  return Math.min(100, Math.max(0, adjustedRor));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

