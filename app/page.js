"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { TerminalHero } from "@/components/terminal-hero";
import "@/styles/terminal.css";

export default function HomePage() {
  const router = useRouter();
  const goToChallenges = useCallback(() => {
    router.push("/challenges");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono relative">
      <div aria-hidden className="scanlines pointer-events-none" />
      <Navbar />
      <TerminalHero onEnter={goToChallenges} />
    </div>
  );
}
