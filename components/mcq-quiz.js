"use client";

import { useMemo, useState } from "react";
import { useWallet } from "@/lib/wallet";
import { mintQuizBadge } from "@/lib/mint-quiz-badge";
import questionsData from "../lib/mcq-questions";

export default function MCQQuiz() {
  const questions = useMemo(() => questionsData, []);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const { address, connect, connecting } = useWallet();

  const score = submitted
    ? answers.reduce((s, a, i) => s + (a === questions[i].answer ? 1 : 0), 0)
    : 0;

  const percentage = Math.round((score / questions.length) * 100);
  const canEarnReward = percentage >= 70;

  function pick(qi, oi) {
    if (submitted) return;
    const next = answers.slice();
    next[qi] = oi;
    setAnswers(next);
  }

  function reset() {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setMintError(null);
    setMintSuccess(false);
  }

  async function handleMintReward() {
    if (!address) {
      return; // The connect button will be handled by the Navbar
    }

    setMinting(true);
    setMintError(null);
    try {
      const result = await mintQuizBadge({
        score,
        totalQuestions: questions.length,
        toAddress: address,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }
      setMintSuccess(true);
    } catch (error) {
      setMintError(error.message);
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300">
        Select answers and click Submit. Total: {questions.length}
        {submitted && canEarnReward && (
          <div className="mt-2 text-emerald-400">
            🎉 Great job! You can claim a reward for your high score.
          </div>
        )}
      </div>

      {questions.map((q, qi) => {
        const picked = answers[qi];
        return (
          <div
            key={q.id}
            className="rounded border border-gray-700 bg-gray-800/40 p-4"
          >
            <div className="font-semibold mb-2">
              Q{qi + 1}. {q.question}
            </div>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const chosen = picked === oi;
                const correct = submitted && oi === q.answer;
                const wrongChosen = submitted && chosen && oi !== q.answer;
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-2 rounded px-3 py-2 cursor-pointer border ${
                      chosen ? "border-indigo-500" : "border-transparent"
                    } ${
                      submitted && correct
                        ? "bg-emerald-800/40"
                        : submitted && wrongChosen
                        ? "bg-red-800/40"
                        : "bg-gray-700/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      className="accent-indigo-500"
                      checked={chosen || false}
                      onChange={() => pick(qi, oi)}
                    />
                    <span>
                      {String.fromCharCode(65 + oi)}. {opt}
                    </span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-2 text-sm text-gray-300">
                Correct: {String.fromCharCode(65 + q.answer)}.{" "}
                {q.options[q.answer]}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
          >
            Submit
          </button>
        ) : (
          <>
            <div className="text-lg font-semibold">
              Score: {score}/{questions.length} ({percentage}%)
            </div>
            <div className="flex gap-3">
              {canEarnReward && !mintSuccess && (
                <button
                  onClick={handleMintReward}
                  disabled={minting || !address}
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                >
                  {minting
                    ? "Minting..."
                    : !address
                    ? "Connect Wallet in Navigation Bar"
                    : "Claim Reward"}
                </button>
              )}
              <button
                onClick={reset}
                className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>

      {!address && canEarnReward && !mintSuccess && (
        <div className="mt-2 text-yellow-400">
          ⚠️ Please connect your wallet using the button in the navigation bar
          to claim your reward
        </div>
      )}

      {mintError && (
        <div className="mt-2 text-red-400">
          Failed to mint reward: {mintError}
        </div>
      )}

      {mintSuccess && (
        <div className="mt-2 text-emerald-400">
          🎉 Reward successfully claimed! Check your wallet.
        </div>
      )}
    </div>
  );
}
