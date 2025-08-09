"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [connecting, setConnecting] = useState(false)

  const syncAccounts = useCallback((accounts) => {
    if (Array.isArray(accounts) && accounts.length > 0) setAddress(accounts[0])
    else setAddress(null)
  }, [])

  useEffect(() => {
    const eth = typeof window !== "undefined" ? window.ethereum : undefined
    if (!eth) return

    eth
      .request?.({ method: "eth_accounts" })
      .then(syncAccounts)
      .catch(() => {})

    const onAccountsChanged = (accs) => syncAccounts(accs)
    const onChainChanged = (cid) => {
      try {
        setChainId(typeof cid === "string" ? Number.parseInt(cid, 16) : cid)
      } catch {
        setChainId(null)
      }
    }

    eth.on?.("accountsChanged", onAccountsChanged)
    eth.on?.("chainChanged", onChainChanged)

    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged)
      eth.removeListener?.("chainChanged", onChainChanged)
    }
  }, [syncAccounts])

  const connect = useCallback(async () => {
    const eth = typeof window !== "undefined" ? window.ethereum : undefined
    setConnecting(true)
    try {
      if (eth?.request) {
        const accs = await eth.request({ method: "eth_requestAccounts" })
        syncAccounts(accs)
        const cid = await eth.request({ method: "eth_chainId" }).catch(() => null)
        if (cid) setChainId(Number.parseInt(cid, 16))
        return { ok: true, address: accs?.[0] || null }
      } else {
      
        try {
          const { openWeb3Modal } = await import("./wallet-connect")
          await openWeb3Modal()
        } catch {
          alert("no injected wallet found. Install MetaMask or configure WalletConnect.")
        }
        return { ok: false }
      }
    } catch (e) {
      console.error(e)
      return { ok: false, error: e?.message || "connect failed" }
    } finally {
      setConnecting(false)
    }
  }, [syncAccounts])

  const disconnect = useCallback(() => {
    setAddress(null)
  }, [])

  const value = useMemo(
    () => ({ address, chainId, connecting, isConnected: !!address, connect, disconnect }),
    [address, chainId, connecting, connect, disconnect],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider")
  return ctx
}
