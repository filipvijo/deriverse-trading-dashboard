"use client";

import React, { FC, ReactNode, createContext, useContext, useMemo } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const MAINNET_RPC = clusterApiUrl("mainnet-beta");

const ConnectionContext = createContext<Connection | null>(null);

export function useSolanaConnection(): Connection {
  const connection = useContext(ConnectionContext);
  if (!connection) {
    throw new Error("useSolanaConnection must be used within SolanaProvider");
  }
  return connection;
}

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const connection = useMemo(() => new Connection(MAINNET_RPC, "confirmed"), []);

  return (
    <ConnectionContext.Provider value={connection}>
      {children}
    </ConnectionContext.Provider>
  );
};
