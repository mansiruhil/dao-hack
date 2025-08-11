"use client";

import MCQQuiz from "../../components/mcq-quiz";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ETHQuiz — MCQ</h1>
      </div>
      <div className="mt-4">
        <MCQQuiz />
      </div>
    </div>
  );
}