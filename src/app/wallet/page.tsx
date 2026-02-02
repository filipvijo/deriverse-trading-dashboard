"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, RefreshCw } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Wallet</h1>
        <p className="text-sm text-slate-400">
          Manage your Solana wallet connection
        </p>
      </div>

      {/* Wallet Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-5 w-5 text-cyan-400" />
            Connected Wallet
          </CardTitle>
          <CardDescription>Your Solana wallet details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-mono text-sm text-slate-200">7xK9...mN4p</p>
                <p className="text-xs text-slate-500">Phantom Wallet</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-400 mb-1">SOL Balance</p>
              <p className="text-xl font-bold text-slate-100">125.45 SOL</p>
              <p className="text-xs text-slate-500">≈ $18,567.42</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-400 mb-1">USDC Balance</p>
              <p className="text-xl font-bold text-slate-100">5,000.00 USDC</p>
              <p className="text-xs text-slate-500">Available for trading</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-400 mb-1">Network</p>
              <p className="text-xl font-bold text-emerald-400">Mainnet</p>
              <p className="text-xs text-slate-500">Connected</p>
            </div>
          </div>

          <Button className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Balances
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

