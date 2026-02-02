"use client";

import { Bell, RefreshCw, Search, Wallet, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTradeStore } from "@/store/tradeStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { refreshData, isLoading } = useTradeStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 md:px-6 backdrop-blur-lg">
      {/* Mobile Menu + Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search - Hidden on mobile */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="search"
            placeholder="Search trades, symbols..."
            className="w-48 md:w-80 pl-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refreshData()}
          disabled={isLoading}
          className="relative"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <div className="mx-1 md:mx-2 h-6 w-px bg-slate-800 hidden sm:block" />

        <Button variant="outline" className="gap-2 text-xs md:text-sm">
          <Wallet className="h-4 w-4" />
          <span className="font-mono hidden sm:inline">7xK9...mN4p</span>
        </Button>
      </div>
    </header>
  );
}

