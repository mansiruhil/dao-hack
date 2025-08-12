"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet";
import { Navbar } from "@/components/navbar";
import { TerminalHero } from "@/components/terminal-hero";
import "@/styles/terminal.css";

export default function HomePage() {
  const router = useRouter();
  const { connect, isConnected } = useWallet();
  const [showConnect, setShowConnect] = useState(false);

  const goToChallenges = useCallback(async () => {
    if (!isConnected) {
      setShowConnect(true);
      const result = await connect();
      if (!result.ok) return;
    }
    router.push("/challenges");
  }, [router, connect, isConnected]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono relative">
      <div aria-hidden className="scanlines pointer-events-none" />
      <Navbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center relative">
          <div className="absolute inset-0 overflow-hidden">
            {/* Matrix-like falling code effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-[#00FF66] text-xs whitespace-nowrap"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: ["0vh", "100vh"],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${Math.random() * 0.5 + 0.8})`,
                  }}
                >
                  {Array.from({ length: 3 })
                    .map(() => Math.random().toString(16).substr(2, 8))
                    .join(" ")}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-glow mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Master Solana Development
              <br />
              <span className="text-cyan-300">Earn While You Learn</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-emerald-300/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Interactive challenges, hands-on coding exercises, and knowledge
              tests. Complete them to earn SOL rewards and level up your
              blockchain skills.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={goToChallenges}
                className="terminal-btn px-8 py-3 text-lg"
              >
                Connect your wallet, Start Your Journey
              </button>
            </motion.div>

            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="terminal-window p-6 space-y-3">
                <h3 className="text-lg font-semibold text-cyan-300">
                  {">"} Interactive Learning
                </h3>
                <p className="text-sm opacity-80">
                  Dive into practical Solana development with our interactive
                  coding challenges. Write, test, and deploy real smart
                  contracts.
                </p>
              </div>
              <div className="terminal-window p-6 space-y-3">
                <h3 className="text-lg font-semibold text-cyan-300">
                  {">"} Test Your Knowledge
                </h3>
                <p className="text-sm opacity-80">
                  Challenge yourself with our comprehensive quizzes covering
                  Solana concepts, blockchain fundamentals, and best practices.
                </p>
              </div>
              <div className="terminal-window p-6 space-y-3">
                <h3 className="text-lg font-semibold text-cyan-300">
                  {">"} Earn Rewards
                </h3>
                <p className="text-sm opacity-80">
                  Get rewarded in SOL for your achievements. Successfully
                  complete challenges and maintain high quiz scores to earn
                  crypto.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </main>
    </div>
  );
}
