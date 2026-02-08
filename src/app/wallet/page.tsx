"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, RefreshCw, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTradeStore } from "@/store/tradeStore";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useSolanaConnection } from "@/providers/SolanaProvider";
import { fetchWalletTrades, getWalletBalance } from "@/lib/solanaDataFetcher";

export default function WalletPage() {
  const { connected, address, isPhantomInstalled, connect, disconnect } = usePhantomWallet();
  const connection = useSolanaConnection();
  const { setWalletTrades, disconnectWallet, dataSource, isLoading } = useTradeStore();

  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [tradeCount, setTradeCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : null;

  // Fetch balance when wallet connects
  const refreshBalance = useCallback(async () => {
    if (!address) return;
    setLoadingBalance(true);
    try {
      const bal = await getWalletBalance(connection, address);
      setBalance(bal);
      setError(null);
    } catch {
      setError("Failed to fetch balance. RPC may be rate-limited.");
    } finally {
      setLoadingBalance(false);
    }
  }, [address, connection]);

  useEffect(() => {
    if (connected && address) {
      refreshBalance();
    } else {
      setBalance(null);
      setTradeCount(null);
    }
  }, [connected, address, refreshBalance]);

  const handleLoadTrades = async () => {
    if (!address) return;
    setLoadingTrades(true);
    setError(null);
    try {
      const trades = await fetchWalletTrades(connection, address, 50);
      setWalletTrades(trades, address);
      setTradeCount(trades.length);
    } catch {
      setError("Failed to fetch transactions. The RPC endpoint may be rate-limited. Try again in a moment.");
    } finally {
      setLoadingTrades(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    disconnectWallet();
    setBalance(null);
    setTradeCount(null);
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Wallet</h1>
        <p className="text-sm text-slate-400">
          Connect your Solana wallet to load real trading data
        </p>
      </div>

      {/* Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-5 w-5 text-cyan-400" />
            {connected ? "Connected Wallet" : "Connect Wallet"}
          </CardTitle>
          <CardDescription>
            {connected
              ? "Your Solana wallet is connected"
              : "Connect Phantom, Solflare, or any Solana wallet"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                <Wallet className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 text-center max-w-md">
                Connect your wallet to fetch real on-chain transaction history and analyze your actual trading performance.
              </p>
              <Button
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 text-base"
                onClick={connect}
              >
                <Wallet className="h-5 w-5" />
                {isPhantomInstalled ? "Connect Phantom Wallet" : "Install Phantom Wallet"}
              </Button>
              <p className="text-xs text-slate-600">
                {isPhantomInstalled
                  ? "Currently showing mock data • Connect wallet for real data"
                  : "Phantom wallet not detected • Install it to connect"}
              </p>
            </div>
          ) : (
            <>
              {/* Wallet Address */}
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-slate-200">{shortAddress}</p>
                    <p className="text-xs text-slate-500">
                      {dataSource === "wallet" ? "✅ Wallet data active" : "Mock data active"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy address">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://solscan.io/account/${address}`} target="_blank" rel="noopener noreferrer" title="View on Solscan">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Balance & Status */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                  <p className="text-xs text-slate-400 mb-1">SOL Balance</p>
                  {loadingBalance ? (
                    <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                  ) : (
                    <>
                      <p className="text-xl font-bold text-slate-100">
                        {balance !== null ? `${balance.toFixed(4)} SOL` : "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {balance !== null ? `≈ $${(balance * 150).toFixed(2)}` : ""}
                      </p>
                    </>
                  )}
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                  <p className="text-xs text-slate-400 mb-1">Data Source</p>
                  <p className={`text-xl font-bold ${dataSource === "wallet" ? "text-emerald-400" : "text-amber-400"}`}>
                    {dataSource === "wallet" ? "On-Chain" : "Mock"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tradeCount !== null ? `${tradeCount} trades loaded` : "Load trades below"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                  <p className="text-xs text-slate-400 mb-1">Network</p>
                  <p className="text-xl font-bold text-emerald-400">Mainnet</p>
                  <p className="text-xs text-slate-500">Connected</p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-800/50 bg-red-900/20 p-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1 gap-2 bg-cyan-600 hover:bg-cyan-500"
                  onClick={handleLoadTrades}
                  disabled={loadingTrades || isLoading}
                >
                  {loadingTrades ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {loadingTrades ? "Loading Transactions..." : "Load My Trades"}
                </Button>
                <Button variant="outline" className="gap-2" onClick={refreshBalance} disabled={loadingBalance}>
                  <RefreshCw className={`h-4 w-4 ${loadingBalance ? "animate-spin" : ""}`} />
                  Refresh Balance
                </Button>
                <Button variant="destructive" className="gap-2" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

