"use client"

import Link from "next/link"
import "@/styles/terminal.css"

export function Navbar() {
  return (
    <nav className="w-full border-b border-emerald-500/20 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
        <Link href="/" className="text-[#00FF66] font-mono text-sm tracking-[0.08em] drop-shadow-[0_0_6px_#00FF66]">
          {"<name soon>"}
        </Link>
        <ConnectWalletCommand />
      </div>
    </nav>
  )
}

function ConnectWalletCommand() {
  const enabled = !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  return (
    <button
      className={`text-cyan-300 hover:text-cyan-200 font-mono text-xs tracking-wide ${enabled ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
      title={enabled ? "Open Web3Modal" : "Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable"}
      onClick={async () => {
        if (!enabled) return
        const { openWeb3Modal } = await import("@/lib/wallet-connect")
        openWeb3Modal()
      }}
    >
      [connect wallet]
    </button>
  )
}
