"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/lib/wallet";
import "@/styles/terminal.css";

export function Navbar() {
  return (
    <nav className="w-full border-b border-emerald-500/20 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[#00FF66] font-mono text-sm tracking-[0.08em] drop-shadow-[0_0_6px_#00FF66]"
          >
            {"<SolMind>"}
          </Link>
          <Link
            href="/challenges"
            className="text-cyan-300 hover:text-cyan-200 font-mono text-xs tracking-wide"
          >
            [learn]
          </Link>
          <Link
            href="/quiz"
            className="text-cyan-300 hover:text-cyan-200 font-mono text-xs tracking-wide"
          >
            [quiz]
          </Link>
        </div>
        <ConnectWalletCommand />
      </div>
    </nav>
  );
}

function ConnectWalletCommand() {
  const { connect, disconnect, isConnected, connecting, address } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until client-side
  if (!mounted) {
    return <div className="w-24" />; // placeholder to prevent layout shift
  }

  const buttonText = connecting
    ? "[connecting...]"
    : isConnected
    ? `[${address?.slice(0, 4)}...${address?.slice(-4)}]`
    : "[connect wallet]";

  return (
    <button
      className="text-cyan-300 hover:text-cyan-200 font-mono text-xs tracking-wide disabled:opacity-60 disabled:cursor-default"
      disabled={connecting}
      onClick={async () => {
        if (isConnected) {
          await disconnect();
        } else {
          await connect();
        }
      }}
    >
      {buttonText}
    </button>
  );
}
