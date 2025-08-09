"use client"

import { WalletProvider } from "@/lib/wallet"

export function AppProviders({ children }) {
  return <WalletProvider>{children}</WalletProvider>
}
