"use client"

import Link from "next/link"

export function ChallengeTable({ challenges = [] }) {
  return (
    <div className="text-emerald-300/90">
      <div className="grid grid-cols-[120px_1fr_120px] px-3 py-2 text-[#00FFFF]">
        <span>{"CHALLENGE_ID"}</span>
        <span>{"TITLE"}</span>
        <span>{"DIFFICULTY"}</span>
      </div>
      <div className="px-3 text-emerald-500/40">
        {Array.from({ length: 56 })
          .map(() => "-")
          .join("")}
      </div>
      <ul className="divide-y divide-emerald-500/20">
        {challenges.map((ch, idx) => (
          <li key={ch.id}>
            <Link
              href={`/challenges/${ch.id}`}
              className="grid grid-cols-[120px_1fr_120px] px-3 py-2 items-center hover:bg-emerald-500/5 transition-colors group"
            >
              <span className="group-hover:text-[#00FF66] group-hover:drop-shadow-[0_0_6px_#00FF66]">{idx + 1}</span>
              <span className="truncate">{ch.title}</span>
              <span className="uppercase text-xs tracking-wide">
                <span
                  className="px-2 py-0.5 rounded border border-emerald-500/30"
                  style={{ background: "rgba(0,255,102,0.06)" }}
                >
                  {ch.difficulty}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-3 py-2 text-xs text-emerald-300/60">{"> click to open a challenge"}</div>
    </div>
  )
}
