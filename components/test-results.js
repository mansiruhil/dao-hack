"use client"

export function TestResults({ result, running, minting = false, txHash = null, mintError = null }) {
  if (running) {
    return (
      <p className="terminal-prompt text-cyan-300">
        {"> Running tests..."}
        <span className="cursor-blink">_</span>
      </p>
    )
  }
  if (!result) {
    return <p className="terminal-prompt text-emerald-200/70">{"> No output yet."}</p>
  }

  const failedSome = !(result.public.passed === result.public.total && result.hidden.passed === result.hidden.total)

  return (
    <div className="space-y-2 text-sm">
      <p className="terminal-prompt text-cyan-300">{"> Public tests:"}</p>
      <ul className="space-y-1">
        {result.public.cases.map((c, i) => (
          <li key={`pub-${i}`} className="terminal-prompt" style={{ color: c.passed ? "#00FF66" : "#FF6666" }}>
            {`> [${c.passed ? "PASS" : "FAIL"}] ${c.name}${c.passed ? "" : c.error ? `: ${c.error}` : ""}`}
          </li>
        ))}
      </ul>

      {result.public.passed === result.public.total && (
        <>
          <p className="terminal-prompt text-cyan-300 mt-2">{"> Hidden tests:"}</p>
          <ul className="space-y-1">
            {result.hidden.cases.map((c, i) => (
              <li key={`hid-${i}`} className="terminal-prompt" style={{ color: c.passed ? "#00FF66" : "#FF6666" }}>
                {`> [${c.passed ? "PASS" : "FAIL"}] ${c.name}${c.passed ? "" : c.error ? `: ${c.error}` : ""}`}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="pt-2 border-t border-emerald-500/20">
        {failedSome ? (
          <div>
            <p className="terminal-prompt" style={{ color: "#FFAA66" }}>
              {"> Some tests failed."}
            </p>
            <pre className="mt-2 p-3 rounded bg-black/60 border border-red-500/30 text-red-300 ascii-confetti">
              {String.raw`
  roror roror roror
  >>> keep hacking...
              `}
            </pre>
          </div>
        ) : (
          <div>
            <p className="terminal-prompt" style={{ color: "#00FF66" }}>
              {"> All tests passed!"}
            </p>
            {minting && (
              <p className="terminal-prompt text-cyan-300">
                {"> Minting NFT badge..."}
                <span className="cursor-blink">_</span>
              </p>
            )}
            {!minting && txHash && (
              <p className="terminal-prompt text-emerald-300">{`> Badge minted. Tx: ${txHash}`}</p>
            )}
            {!minting && mintError && <p className="terminal-prompt text-red-300">{`> Mint failed: ${mintError}`}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
