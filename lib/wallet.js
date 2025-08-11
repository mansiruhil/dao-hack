"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";

const WalletContext = createContext(null);

// Configure the cluster connection
const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";
const config = {
  commitment: "confirmed",
};

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("walletAddress");
      return saved || null;
    }
    return null;
  });
  const [connecting, setConnecting] = useState(false);
  const [wallet] = useState(() => new PhantomWalletAdapter());

  // Setup wallet event listeners
  useEffect(() => {
    if (!wallet) return;

    const onDisconnect = () => {
      setPublicKey(null);
      localStorage.removeItem("walletAddress");
    };

    wallet.on("disconnect", onDisconnect);

    // Try to eagerly connect if we have a saved address
    if (publicKey) {
      wallet.connect().catch(() => {
        // If reconnection fails, clear the saved state
        setPublicKey(null);
        localStorage.removeItem("walletAddress");
      });
    }

    return () => {
      wallet.off("disconnect", onDisconnect);
    };
  }, [wallet, publicKey]);

  const disconnect = useCallback(async () => {
    if (wallet) {
      await wallet.disconnect();
      setPublicKey(null);
      localStorage.removeItem("walletAddress");
    }
  }, [wallet]);

  const connect = useCallback(async () => {
    if (!wallet) return { ok: false, error: "No wallet found" };

    try {
      setConnecting(true);
      await wallet.connect();
      const key = wallet.publicKey;
      if (key) {
        const address = key.toString();
        setPublicKey(address);
        localStorage.setItem("walletAddress", address);
        return { ok: true, address };
      }
      return { ok: false, error: "Failed to get public key" };
    } catch (e) {
      console.error("Failed to connect:", e);
      return { ok: false, error: e.message };
    } finally {
      setConnecting(false);
    }
  }, [wallet]);

  const value = useMemo(
    () => ({
      address: publicKey,
      connecting,
      isConnected: !!publicKey,
      connect,
      disconnect,
      wallet,
    }),
    [publicKey, connecting, connect, disconnect, wallet]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <SolanaWalletProvider wallets={[wallet]} autoConnect>
        <WalletContext.Provider value={value}>
          {children}
        </WalletContext.Provider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
