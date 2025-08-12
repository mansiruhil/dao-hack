"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LevelBasedQuiz from "../../components/level-based-quiz";
import "@/styles/terminal.css";
import { useWallet } from "@/lib/wallet";
import { WalletRequiredModal } from "@/components/wallet-required-modal";
import { Navbar } from "@/components/navbar";

export default function Page() {
  const { isConnected } = useWallet();
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setShowConnect(true);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono relative">
      <div aria-hidden className="scanlines pointer-events-none" />
      <Navbar />
      <nav className="mx-auto max-w-6xl px-4 py-4 text-sm">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          {"> cd .."}
        </Link>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="terminal-heading">{"> solmind — level-based quiz system"}</h1>
        <div className="mt-4 rounded-lg border border-emerald-500/20 bg-black/40 shadow-[0_0_30px_rgba(0,255,102,0.08)]">
          <div className="p-6">
            <LevelBasedQuiz />
          </div>
        </div>
      </main>

      <WalletRequiredModal open={showConnect} onOpenChange={setShowConnect} />
    </div>
  );
}
