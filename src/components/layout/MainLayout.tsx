"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar, MobileMenuButton } from "./Sidebar";
import { Header } from "./Header";
import { useTradeStore } from "@/store/tradeStore";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { initializeData } = useTradeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="md:pl-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

