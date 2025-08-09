"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChallengeTable } from "@/components/challenge-table"
import "@/styles/terminal.css"

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/challenges", { cache: "no-store" })
        const data = await r.json()
        setChallenges(data.challenges || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono relative">
      <div aria-hidden className="scanlines pointer-events-none" />
      <nav className="mx-auto max-w-6xl px-4 py-4 text-sm">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          {"> cd .."}
        </Link>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="terminal-heading">{"> challenge list"}</h1>
        <div className="mt-4 rounded-lg border border-emerald-500/20 bg-black/40 shadow-[0_0_30px_rgba(0,255,102,0.08)]">
          {loading ? (
            <div className="p-4 text-emerald-300">{"loading challenges..."}</div>
          ) : (
            <ChallengeTable challenges={challenges} />
          )}
        </div>
      </main>
    </div>
  )
}
