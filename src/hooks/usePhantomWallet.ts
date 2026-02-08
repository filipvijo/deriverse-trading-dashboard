"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";

interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: { solana?: PhantomProvider };
  }
}

function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;

  // Phantom injects at window.phantom.solana or window.solana
  const provider = window.phantom?.solana || window.solana;
  if (provider?.isPhantom) return provider;
  return null;
}

export function usePhantomWallet() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  // Detect Phantom wallet on mount
  useEffect(() => {
    const detect = () => {
      const p = getPhantomProvider();
      if (p) {
        setProvider(p);
        setIsPhantomInstalled(true);
        if (p.isConnected && p.publicKey) {
          setConnected(true);
          setPublicKey(p.publicKey);
        }
      }
    };

    // Phantom may inject after initial render
    detect();
    const timer = setTimeout(detect, 500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for wallet events
  useEffect(() => {
    if (!provider) return;

    const handleConnect = () => {
      setConnected(true);
      setPublicKey(provider.publicKey);
    };

    const handleDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
    };

    const handleAccountChanged = (newPublicKey: unknown) => {
      if (newPublicKey instanceof PublicKey) {
        setPublicKey(newPublicKey);
      } else {
        // Disconnected or switched to an account not trusted
        setConnected(false);
        setPublicKey(null);
      }
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);
    provider.on("accountChanged", handleAccountChanged);

    return () => {
      provider.off("connect", handleConnect);
      provider.off("disconnect", handleDisconnect);
      provider.off("accountChanged", handleAccountChanged);
    };
  }, [provider]);

  const connect = useCallback(async () => {
    if (!provider) {
      // Redirect to Phantom install page
      window.open("https://phantom.app/", "_blank");
      return;
    }
    try {
      const resp = await provider.connect();
      setPublicKey(resp.publicKey);
      setConnected(true);
    } catch (err) {
      console.error("Phantom connect error:", err);
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (!provider) return;
    try {
      await provider.disconnect();
      setPublicKey(null);
      setConnected(false);
    } catch (err) {
      console.error("Phantom disconnect error:", err);
    }
  }, [provider]);

  return {
    provider,
    connected,
    publicKey,
    address: publicKey?.toBase58() || null,
    isPhantomInstalled,
    connect,
    disconnect,
  };
}

