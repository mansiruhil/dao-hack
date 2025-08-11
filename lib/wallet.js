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
  const [publicKey, setPublicKey] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [wallet] = useState(() => new PhantomWalletAdapter());

  const disconnect = useCallback(async () => {
    if (wallet) {
      await wallet.disconnect();
      setPublicKey(null);
    }
  }, [wallet]);

  const connect = useCallback(async () => {
    if (!wallet) return { ok: false, error: "No wallet found" };

    try {
      setConnecting(true);
      await wallet.connect();
      const key = wallet.publicKey;
      if (key) {
        setPublicKey(key.toString());
        return { ok: true, address: key.toString() };
      }
      return { ok: false, error: "Failed to get public key" };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e?.message || "Connect failed" };
    } finally {
      setConnecting(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (!wallet) return;

    const onConnect = () => {
      if (wallet.publicKey) {
        setPublicKey(wallet.publicKey.toString());
      }
    };

    const onDisconnect = () => {
      setPublicKey(null);
    };

    wallet.on("connect", onConnect);
    wallet.on("disconnect", onDisconnect);

    return () => {
      wallet.off("connect", onConnect);
      wallet.off("disconnect", onDisconnect);
    };
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
