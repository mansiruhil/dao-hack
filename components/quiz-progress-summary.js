"use client";

import { useMemo } from "react";
import { QuizProgress } from "./level-based-quiz";

export function QuizProgressSummary() {
  const quizProgress = useMemo(() => new QuizProgress(), []);
  const progress = quizProgress.getOverallProgress();

  return (
    <div className="mb-8 text-center space-y-2">
      <div className="text-lg font-bold text-emerald-400">
        Your Learning Progress
      </div>
      <div className="flex items-center justify-center gap-2 text-emerald-300">
        <span>{progress.completed}</span>
        <div className="w-32 h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <span>{progress.total}</span>
      </div>
      <div className="text-sm text-emerald-300/70">
        {progress.completed === 0
          ? "Start your learning journey!"
          : progress.completed === progress.total
          ? "🎉 You've mastered all levels!"
          : `${progress.percentage}% Complete`}
      </div>
    </div>
  );
}
