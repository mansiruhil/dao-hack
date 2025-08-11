import { mintBadge } from "./mint-badge";

export async function mintQuizBadge({ score, totalQuestions, toAddress }) {
  // Only mint if score is at least 70%
  const percentage = (score / totalQuestions) * 100;
  if (percentage < 70) {
    return {
      ok: false,
      error: "Score needs to be at least 70% to earn a reward",
    };
  }

  return mintBadge({
    challengeId: "quiz-mastery",
    title: `Quiz Master - Score: ${percentage}%`,
    toAddress,
    difficulty: "medium",
  });
}
