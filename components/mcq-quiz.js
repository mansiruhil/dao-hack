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

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300">
        Select answers and click Submit. Total: {questions.length}
      </div>

      {questions.map((q, qi) => {
        const picked = answers[qi];
        return (
          <div key={q.id} className="rounded border border-gray-700 bg-gray-800/40 p-4">
            <div className="font-semibold mb-2">Q{qi + 1}. {q.question}</div>
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
                    <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-2 text-sm text-gray-300">
                Correct: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded bg-emerald-600">Submit</button>
        ) : (
          <>
            <div className="text-lg font-semibold">
              Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
            <button onClick={reset} className="px-3 py-2 rounded bg-gray-700">Reset</button>
          </>
        )}
      </div>
    </div>
  );
}