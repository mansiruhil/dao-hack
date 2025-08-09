"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"

const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-4 text-emerald-300">{"> loading editor..."}</div>,
})

export function EditorPanel({ initialCode = "", onRun = () => {}, running = false, entryFunction = "" }) {
  const [code, setCode] = useState(initialCode)
  useEffect(() => setCode(initialCode), [initialCode])
  const supportsMonaco = useMemo(() => true, [])
  const taRef = useRef(null)

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-500/20">
        <div className="text-sm text-emerald-200/80">
          {"> edit "} <span className="text-cyan-300">{entryFunction}()</span>
        </div>
        <button
          disabled={running}
          onClick={() => onRun(code)}
          className="terminal-btn"
          title="Run public tests (hidden tests auto-run on success)"
        >
          {running ? "> running..." : "> run tests"}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full">
          <div className="h-full">
            {/* editor */}
            <Monaco
              theme="vs-dark"
              language="javascript"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
              }}
              height="100%"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-500/20 px-3 py-2 text-xs text-emerald-300/60">
        {"> Press the button above to execute tests"}
      </div>
    </div>
  )
}
