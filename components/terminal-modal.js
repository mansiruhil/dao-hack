"use client"

import { useEffect } from "react"

export function TerminalModal({ open, onOpenChange, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") onOpenChange?.(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange?.(false)
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg mx-4 rounded-lg border border-emerald-500/30 bg-black/85 text-[#D0FFD0] font-mono shadow-[0_0_30px_rgba(0,255,102,0.12)]">
        <div className="px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="text-[#00FF66] drop-shadow-[0_0_6px_#00FF66]">
            {"> "}
            {title}
          </div>
          <button
            className="text-cyan-300 hover:text-cyan-200"
            onClick={() => onOpenChange?.(false)}
            aria-label="Close"
          >
            [x]
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
