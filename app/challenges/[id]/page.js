"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/terminal.css";
import { EditorPanel } from "@/components/editor-panel";
import { TestResults } from "@/components/test-results";
import { runChallenge } from "@/lib/test-runner";
import { useWallet } from "@/lib/wallet";
import { mintBadge } from "@/lib/mint-badge";
import { Navbar } from "@/components/navbar";

export default function ChallengeEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { address, connect } = useWallet();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const [minting, setMinting] = useState(false);
  const [mintTx, setMintTx] = useState(null);
  const [mintError, setMintError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/challenges/${id}`, { cache: "no-store" });
        if (!r.ok) throw new Error("not found");
        const data = await r.json();
        setChallenge(data.challenge);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const header = useMemo(() => {
    if (!challenge) return null;
    return (
      <header className="border-b border-emerald-500/20 bg-black/40 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="terminal-heading text-lg sm:text-xl whitespace-pre-wrap">
            {"> "} {challenge.title}
          </h1>
          <span className="uppercase text-xs tracking-wide">
            <span
              className="px-2 py-0.5 rounded border border-emerald-500/30"
              style={{ background: "rgba(0,255,102,0.06)", color: "#D0FFD0" }}
            >
              {challenge.difficulty}
            </span>
          </span>
        </div>
      </header>
    );
  }, [challenge]);

  async function handleRun(code) {
    if (!challenge) return;
    setRunning(true);
    setResults(null);
    setMintError(null);
    setMintTx(null);
    try {
      const run = await runChallenge(
        code,
        challenge.entryFunction,
        challenge.publicIOTests,
        challenge.hiddenIOTests
      );
      setResults(run);

      if (run.allPassed) {
        if (!address) {
          await connect();
        }
        if (address || typeof window !== "undefined") {
          setMinting(true);
          const res = await mintBadge({
            challengeId: challenge.id,
            title: challenge.title,
            toAddress: address || "0xMOCK",
            difficulty: challenge.difficulty,
          });
          if (res.ok) {
            setMintTx(res.txHash);
          } else {
            setMintError(res.error || "mint failed");
          }
          setMinting(false);
        }
      }
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono">
        <Navbar />
        <nav className="px-4 py-4">
          <button
            onClick={() => router.push("/challenges")}
            className="text-cyan-300 hover:text-cyan-200"
          >
            {"> cd .."}
          </button>
        </nav>
        <div className="px-4 py-10">{"loading challenge..."}</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono">
        <Navbar />
        <div className="p-6">
          <p className="terminal-prompt">{"> challenge not found"}</p>
          <button
            onClick={() => router.push("/challenges")}
            className="mt-4 text-cyan-300 hover:text-cyan-200"
          >
            {"> go back"}
          </button>
        </div>
      </div>
    );
  }

  const examples = (challenge.publicIOTests || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#D0FFD0] font-mono">
      <div aria-hidden className="scanlines pointer-events-none" />
      <Navbar />
      <nav className="mx-auto max-w-7xl px-4 py-4 text-sm">
        <button
          onClick={() => router.push("/challenges")}
          className="text-cyan-300 hover:text-cyan-200"
        >
          {"> cd .."}
        </button>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-10">
        {header}

        <section className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
          {/* Left: Question */}
          <aside className="rounded-lg border border-emerald-500/20 bg-black/40 p-4">
            <h3 className="terminal-heading">{"> question"}</h3>
            <p className="mt-2 text-emerald-100/90">{challenge.description}</p>

            <div className="mt-4">
              <p className="terminal-heading">{"> function signature"}</p>
              <pre className="mt-2 p-3 rounded bg-black/60 border border-emerald-500/20 overflow-x-auto">
                {`function ${challenge.entryFunction}(...args) { /* your code */ }`}
              </pre>
            </div>

            {examples.length > 0 && (
              <div className="mt-4">
                <p className="terminal-heading">{"> examples"}</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {examples.map((ex, i) => (
                    <li key={i} className="terminal-prompt">
                      {`> ${challenge.entryFunction}(${ex.args
                        .map((a) => JSON.stringify(a))
                        .join(", ")}) // => ${JSON.stringify(ex.expect)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!address ? (
              <button
                onClick={connect}
                className="mt-6 terminal-btn"
                title="Connect wallet to receive NFT badge on success"
              >
                {"> connect wallet"}
              </button>
            ) : (
              <div className="mt-6 text-xs text-emerald-300/70">{`> connected: ${address.slice(
                0,
                6
              )}...${address.slice(-4)}`}</div>
            )}
          </aside>

          {/* Right: Answer/Editor + Results */}
          <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="rounded-lg border border-emerald-500/20 bg-black/40 overflow-hidden">
              <EditorPanel
                initialCode={challenge.starterCode}
                onRun={handleRun}
                running={running}
                entryFunction={challenge.entryFunction}
              />
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-black/40 p-4">
              <h3 className="terminal-heading mb-3">{"> output"}</h3>
              <TestResults
                result={results}
                running={running}
                minting={minting}
                txHash={mintTx}
                mintError={mintError}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
