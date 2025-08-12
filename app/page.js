"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet";
import { Navbar } from "@/components/navbar";
import { TerminalHero } from "@/components/terminal-hero";
import "@/styles/terminal.css";

const MatrixBackground = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const generateCharacters = () =>
      Array.from({ length: 20 }).map(() => ({
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 2,
        left: `${Math.random() * 100}%`,
        scale: Math.random() * 0.5 + 0.8,
        text: Array.from({ length: 3 })
          .map(() => Math.random().toString(16).substr(2, 8))
          .join(" "),
      }));

    setCharacters(generateCharacters());
  }, []);

  return (
    <div className="absolute inset-0 opacity-20">
      {characters.map((char, i) => (
        <motion.div
          key={i}
          className="absolute text-[#00FF66] text-xs whitespace-nowrap"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: [0, 1, 0],
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration: char.duration,
            repeat: Infinity,
            delay: char.delay,
          }}
          style={{
            left: char.left,
            transform: `scale(${char.scale})`,
          }}
        >
          {char.text}
        </motion.div>
      ))}
    </div>
  );
};

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

      {/* Global Matrix Effect Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <MatrixBackground />
      </div>

      <Navbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center relative">
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

        {/* Navigation Cards Section */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="terminal-heading text-xl mb-8">{"> explore"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Learn Card */}
              <div
                onClick={() => router.push("/challenges")}
                className="cursor-pointer group rounded-lg border border-emerald-500/20 bg-black/40 p-6 transition-all duration-200 hover:border-emerald-500/40 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(0,255,102,0.08)]"
              >
                <h3 className="terminal-heading mb-3">{"> learn.sol"}</h3>
                <p className="text-sm text-emerald-100/70 mb-4">
                  Master Solana through interactive coding challenges. Write,
                  test, and deploy Solana programs.
                </p>
                <span className="text-cyan-300 group-hover:text-cyan-200 text-xs">
                  [enter challenges] →
                </span>
              </div>

              {/* Quiz Card */}
              <div
                onClick={() => router.push("/quiz")}
                className="cursor-pointer group rounded-lg border border-emerald-500/20 bg-black/40 p-6 transition-all duration-200 hover:border-emerald-500/40 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(0,255,102,0.08)]"
              >
                <h3 className="terminal-heading mb-3">{"> quiz.sol"}</h3>
                <p className="text-sm text-emerald-100/70 mb-4">
                  Test your Solana knowledge with our interactive quizzes. Earn
                  badges for high scores.
                </p>
                <span className="text-cyan-300 group-hover:text-cyan-200 text-xs">
                  [start quiz] →
                </span>
              </div>

              {/* Resources Card */}
              <div className="cursor-pointer group rounded-lg border border-emerald-500/20 bg-black/40 p-6 transition-all duration-200 hover:border-emerald-500/40 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(0,255,102,0.08)]">
                <h3 className="terminal-heading mb-3">{"> docs.sol"}</h3>
                <p className="text-sm text-emerald-100/70 mb-4">
                  Access curated Solana documentation, best practices, and
                  program development guides.
                </p>
                <div className="flex flex-row gap-7">
                  <span
                    onClick={() =>
                      window.open(
                        "https://solana.com/docs/intro/quick-start",
                        "_blank"
                      )
                    }
                    className="text-cyan-300 group-hover:text-cyan-200 text-xs cursor-pointer"
                  >
                    [quickstart guide] →
                  </span>
                  <span
                    onClick={() =>
                      window.open("https://solana.com/docs", "_blank")
                    }
                    className="text-cyan-300 group-hover:text-cyan-200 text-xs cursor-pointer"
                  >
                    [for developers] →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="terminal-heading text-xl mb-8">
              {"> user.reviews"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="terminal-window p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-[#00FF66]">{">"}</span>
                  </div>
                  <div>
                    <div className="terminal-heading text-sm mb-2">
                      @priya_dev_blr
                    </div>
                    <p className="text-sm text-emerald-100/70 mb-2">
                      "As a developer from Bangalore, this platform is exactly
                      what I needed! The step-by-step Solana challenges helped
                      me transition from Web2 to Web3. Love how it explains
                      complex concepts in simple terms."
                    </p>
                    <div className="text-cyan-300 text-xs">
                      {"> earned: solana_pioneer.badge"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="terminal-window p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-[#00FF66]">{">"}</span>
                  </div>
                  <div>
                    <div className="terminal-heading text-sm mb-2">
                      @raj_web3_pune
                    </div>
                    <p className="text-sm text-emerald-100/70 mb-2">
                      "Greetings from Pune's tech hub! The quiz format is
                      brilliant for preparation. Cleared multiple Web3
                      interviews thanks to the deep dive into Solana's
                      architecture. Worth every minute!"
                    </p>
                    <div className="text-cyan-300 text-xs">
                      {"> completed: all_advanced_modules"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="terminal-window p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-[#00FF66]">{">"}</span>
                  </div>
                  <div>
                    <div className="terminal-heading text-sm mb-2">
                      @arjun_dapps_delhi
                    </div>
                    <p className="text-sm text-emerald-100/70 mb-2">
                      "Started learning during my final year at IIT Delhi. The
                      practical assignments on Program Derived Addresses and
                      Token Programs are gold! Now building my own DeFi protocol
                      on Solana."
                    </p>
                    <div className="text-cyan-300 text-xs">
                      {"> status: defi_expert.level"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="terminal-window p-6 text-center">
                <div className="text-2xl font-bold text-[#00FF66] mb-2">
                  1,500+
                </div>
                <div className="text-xs text-emerald-100/70">
                  Active Learners
                </div>
              </div>
              <div className="terminal-window p-6 text-center">
                <div className="text-2xl font-bold text-[#00FF66] mb-2">
                  50K
                </div>
                <div className="text-xs text-emerald-100/70">SOL Rewarded</div>
              </div>
              <div className="terminal-window p-6 text-center">
                <div className="text-2xl font-bold text-[#00FF66] mb-2">
                  10+
                </div>
                <div className="text-xs text-emerald-100/70">
                  Challenges (and more coming soon :D)
                </div>
              </div>
              <div className="terminal-window p-6 text-center">
                <div className="text-2xl font-bold text-[#00FF66] mb-2">
                  95%
                </div>
                <div className="text-xs text-emerald-100/70">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </main>
    </div>
  );
}
