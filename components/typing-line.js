"use client"

import { useEffect, useState } from "react"

export function TypingLine({ text = "", speed = 24, delay = 0, glow = false, onDone, onClick }) {
  const [shown, setShown] = useState("")

  useEffect(() => {
    let mounted = true
    const start = () => {
      const total = text.length
      let i = 0
      const interval = setInterval(() => {
        if (!mounted) return clearInterval(interval)
        i++
        setShown(text.slice(0, i))
        if (i >= total) {
          clearInterval(interval)
          onDone && onDone()
        }
      }, 1000 / speed)
    }
    const t = setTimeout(start, delay * 1000)
    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [text, speed, delay, onDone])

  return (
    <p className={`terminal-prompt ${glow ? "text-glow" : ""} cursor-pointer select-none`} onClick={onClick}>
      <span>{shown}</span>
      <span className="cursor-blink">_</span>
    </p>
  )
}
