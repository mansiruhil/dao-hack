"use client";

import { useMemo, useState } from "react";
import questionsData from "../lib/mcq-questions";

export default function MCQQuiz() {
  const questions = useMemo(() => questionsData, []);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? answers.reduce((s, a, i) => s + (a === questions[i].answer ? 1 : 0), 0)
    : 0;

  function pick(qi, oi) {
    if (submitted) return;
    const next = answers.slice();
    next[qi] = oi;
    setAnswers(next);
  }

  function reset() {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  }

  function clearQuestion(qi) {
    if (submitted) return;
    const next = answers.slice();
    next[qi] = null;
    setAnswers(next);
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-cyan-300 font-mono">
        Select answers and click Submit. Total: {questions.length}
      </div>

      {questions.map((q, qi) => {
        const picked = answers[qi];
        return (
          <div key={q.id} className="terminal-window relative">
            <div className="font-semibold mb-4 text-[#D0FFD0]">Q{qi + 1}. {q.question}</div>
            <div className="grid gap-3 mb-6">
              {q.options.map((opt, oi) => {
                const chosen = picked === oi;
                const correct = submitted && oi === q.answer;
                const wrongChosen = submitted && chosen && oi !== q.answer;
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 rounded px-4 py-3 cursor-pointer border transition-all duration-200 ${
                      chosen ? "border-[#00FF66] bg-[#00FF66]/10" : "border-emerald-500/20 bg-black/20"
                    } ${
                      submitted && correct
                        ? "border-emerald-500 bg-emerald-500/20"
                        : submitted && wrongChosen
                        ? "border-red-500 bg-red-500/20"
                        : ""
                    } hover:border-emerald-500/40 hover:bg-black/30`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      className="accent-[#00FF66]"
                      checked={chosen || false}
                      onChange={() => pick(qi, oi)}
                    />
                    <span className="text-[#D0FFD0] font-mono">{String.fromCharCode(65 + oi)}. {opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-4 text-sm text-emerald-300 font-mono">
                Correct: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}
              </div>
            )}
            {picked !== null && !submitted && (
              <div className="absolute bottom-2 right-4">
                <button
                  onClick={() => clearQuestion(qi)}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-mono cursor-pointer transition-colors duration-200 px-2"
                >
                  [clear selection]
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-8 flex items-center gap-4">
        {!submitted ? (
          <button 
            onClick={() => setSubmitted(true)} 
            className="terminal-btn px-6 py-3 text-base"
          >
            Submit
          </button>
        ) : (
          <>
            <div className="text-lg font-semibold text-[#00FF66] font-mono">
              Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
            <button 
              onClick={reset} 
              className="terminal-btn px-4 py-2 text-sm"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}