// components/level-based-quiz.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useWallet } from "@/lib/wallet";
import { mintQuizBadge } from "@/lib/mint-quiz-badge";

// Quiz progress management
function getStoredProgress() {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("solmind_quiz_progress");
  return stored ? JSON.parse(stored) : {};
}

// Quiz Levels Data
const QUIZ_LEVELS = {
  BEGINNER: {
    id: "beginner",
    name: "Beginner",
    description: "Basic Solana concepts and blockchain fundamentals",
    requiredScore: 70,
    questions: [
      {
        id: "b1",
        question: "What is Solana?",
        options: [
          "A centralized database",
          "A high-performance blockchain platform",
          "A programming language",
          "A mobile application",
        ],
        answer: 1,
        explanation:
          "Solana is a high-performance blockchain platform designed for decentralized applications and crypto-currencies.",
      },
      {
        id: "b2",
        question: "What is the native cryptocurrency of Solana?",
        options: ["ETH", "BTC", "SOL", "ADA"],
        answer: 2,
        explanation:
          "SOL is the native cryptocurrency of the Solana blockchain.",
      },
      {
        id: "b3",
        question: "What consensus mechanism does Solana use?",
        options: [
          "Proof of Work",
          "Proof of Stake",
          "Proof of History + Proof of Stake",
          "Delegated Proof of Stake",
        ],
        answer: 2,
        explanation:
          "Solana uses a unique combination of Proof of History (PoH) and Proof of Stake for consensus.",
      },
      {
        id: "b4",
        question: "What is a wallet in the context of Solana?",
        options: [
          "A physical wallet for storing cash",
          "A software that stores your private keys",
          "A bank account",
          "A mining device",
        ],
        answer: 1,
        explanation:
          "A wallet is software that stores your private keys and allows you to interact with the blockchain.",
      },
      {
        id: "b5",
        question: "What is the approximate transaction speed of Solana?",
        options: ["7 TPS", "1,000 TPS", "50,000+ TPS", "100 TPS"],
        answer: 2,
        explanation:
          "Solana can process over 50,000 transactions per second, making it one of the fastest blockchains.",
      },
    ],
  },
  INTERMEDIATE: {
    id: "intermediate",
    name: "Intermediate",
    description: "Solana programs, accounts, and development basics",
    requiredScore: 75,
    questions: [
      {
        id: "i1",
        question: "What are Solana programs?",
        options: [
          "User applications",
          "Smart contracts on Solana",
          "Operating system programs",
          "Mining software",
        ],
        answer: 1,
        explanation:
          "Solana programs are equivalent to smart contracts on other blockchains.",
      },
      {
        id: "i2",
        question:
          "What language is primarily used for Solana program development?",
        options: ["JavaScript", "Python", "Rust", "Go"],
        answer: 2,
        explanation:
          "Rust is the primary language for developing Solana programs due to its performance and safety features.",
      },
      {
        id: "i3",
        question: "What is a Program Derived Address (PDA)?",
        options: [
          "A regular wallet address",
          "An address derived from a program ID and seeds",
          "A validator address",
          "A token mint address",
        ],
        answer: 1,
        explanation:
          "PDAs are addresses derived deterministically from a program ID and optional seeds, allowing programs to control accounts.",
      },
      {
        id: "i4",
        question: "What is the rent mechanism in Solana?",
        options: [
          "Payment for using programs",
          "Fee for creating accounts that must maintain minimum balance",
          "Validator rewards",
          "Transaction fees",
        ],
        answer: 1,
        explanation:
          "Rent is a mechanism requiring accounts to maintain a minimum balance to stay on the network, preventing spam.",
      },
      {
        id: "i5",
        question: "What is an instruction in Solana?",
        options: [
          "A compiler directive",
          "A single operation to be processed by a program",
          "A transaction type",
          "A block validation rule",
        ],
        answer: 1,
        explanation:
          "An instruction is a single operation that tells a program what action to perform.",
      },
    ],
  },
  ADVANCED: {
    id: "advanced",
    name: "Advanced",
    description: "Complex Solana concepts, DeFi, and advanced programming",
    requiredScore: 80,
    questions: [
      {
        id: "a1",
        question: "What is the purpose of the System Program in Solana?",
        options: [
          "Managing tokens",
          "Creating and managing accounts",
          "Validating transactions",
          "Storing program data",
        ],
        answer: 1,
        explanation:
          "The System Program is responsible for creating new accounts, transferring SOL, and managing account ownership.",
      },
      {
        id: "a2",
        question: "What is Cross-Program Invocation (CPI)?",
        options: [
          "A debugging technique",
          "A way for one program to call another program",
          "A consensus mechanism",
          "A token standard",
        ],
        answer: 1,
        explanation:
          "CPI allows one program to invoke instructions on another program, enabling composability.",
      },
      {
        id: "a3",
        question: "What is the purpose of the Token Program?",
        options: [
          "Mining tokens",
          "Creating and managing SPL tokens",
          "Validating blocks",
          "Storing metadata",
        ],
        answer: 1,
        explanation:
          "The Token Program handles the creation, minting, and management of SPL (Solana Program Library) tokens.",
      },
      {
        id: "a4",
        question: "What is a Metaplex NFT?",
        options: [
          "A gaming token",
          "A standardized NFT implementation on Solana",
          "A DeFi protocol",
          "A validator node",
        ],
        answer: 1,
        explanation:
          "Metaplex provides the standard for creating and managing NFTs on Solana with rich metadata.",
      },
      {
        id: "a5",
        question:
          "What is the difference between mutable and immutable accounts?",
        options: [
          "Mutable accounts can be modified, immutable cannot",
          "Immutable accounts cost more rent",
          "Mutable accounts are faster",
          "There is no difference",
        ],
        answer: 0,
        explanation:
          "Mutable accounts can have their data modified after creation, while immutable accounts cannot be changed.",
      },
    ],
  },
  EXPERT: {
    id: "expert",
    name: "Expert",
    description: "Advanced DeFi, security, and optimization techniques",
    requiredScore: 85,
    questions: [
      {
        id: "e1",
        question: "What is a common security vulnerability in Solana programs?",
        options: [
          "Integer overflow",
          "Signer authorization bypass",
          "Reentrancy attacks",
          "All of the above",
        ],
        answer: 3,
        explanation:
          "Solana programs can be vulnerable to various security issues including authorization bypasses, integer overflows, and reentrancy-like attacks.",
      },
      {
        id: "e2",
        question: "What is the purpose of account size optimization?",
        options: [
          "Reducing rent costs",
          "Improving performance",
          "Better data organization",
          "All of the above",
        ],
        answer: 3,
        explanation:
          "Optimizing account size reduces rent costs, improves performance, and allows for better data organization.",
      },
      {
        id: "e3",
        question: "What is a flash loan in DeFi context?",
        options: [
          "A very fast loan",
          "An uncollateralized loan that must be repaid in the same transaction",
          "A loan with low interest",
          "A loan for purchasing tokens",
        ],
        answer: 1,
        explanation:
          "Flash loans are uncollateralized loans that must be borrowed and repaid within the same transaction.",
      },
      {
        id: "e4",
        question: "What is the purpose of compute budget in Solana?",
        options: [
          "Limiting transaction costs",
          "Preventing infinite loops and resource exhaustion",
          "Optimizing validator performance",
          "Managing network congestion",
        ],
        answer: 1,
        explanation:
          "Compute budget limits prevent transactions from consuming too many computational resources.",
      },
      {
        id: "e5",
        question: "What is Anchor framework used for?",
        options: [
          "Web development",
          "Simplifying Solana program development with Rust",
          "Mobile app development",
          "Database management",
        ],
        answer: 1,
        explanation:
          "Anchor is a framework that provides higher-level abstractions for developing Solana programs in Rust.",
      },
    ],
  },
};

// Progress Tracking Class
export class QuizProgress {
  constructor() {
    this.storageKey = "solmind_quiz_progress";
    this.loadProgress();
  }

  loadProgress() {
    if (typeof window === "undefined") {
      this.progress = {};
      return;
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      this.progress = saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn("Failed to load quiz progress:", e);
      this.progress = {};
    }
  }

  saveProgress() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (e) {
      console.warn("Failed to save quiz progress:", e);
    }
  }

  getLevelProgress(levelId) {
    return (
      this.progress[levelId] || {
        completed: false,
        bestScore: 0,
        attempts: 0,
        lastAttempt: null,
      }
    );
  }

  updateLevelProgress(levelId, score, totalQuestions) {
    const current = this.getLevelProgress(levelId);
    const percentage = Math.round((score / totalQuestions) * 100);
    const requiredScore = QUIZ_LEVELS[levelId.toUpperCase()].requiredScore;

    this.progress[levelId] = {
      completed: percentage >= requiredScore || current.completed, // Keep completed status if already completed
      bestScore: Math.max(current.bestScore, percentage),
      attempts: current.attempts + 1,
      lastAttempt: new Date().toISOString(),
    };

    this.saveProgress();
    return this.progress[levelId];
  }

  isLevelUnlocked(levelId) {
    return true; // All levels are now always unlocked
  }

  getOverallProgress() {
    const levels = Object.keys(QUIZ_LEVELS);
    const completed = levels.filter(
      (levelId) => this.getLevelProgress(levelId.toLowerCase()).completed
    ).length;

    return {
      completed,
      total: levels.length,
      percentage: Math.round((completed / levels.length) * 100),
    };
  }
}

// Main Component
export default function LevelBasedQuiz() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintTx, setMintTx] = useState(null);
  const [progress, setProgress] = useState({});

  const { address, connect } = useWallet();
  const quizProgress = useMemo(() => new QuizProgress(), []);

  // Initialize progress only once when component mounts
  useEffect(() => {
    const loadedProgress = {};
    Object.keys(QUIZ_LEVELS).forEach((levelId) => {
      loadedProgress[levelId.toLowerCase()] = quizProgress.getLevelProgress(
        levelId.toLowerCase()
      );
    });
    setProgress(loadedProgress);
  }, [quizProgress]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return answers.reduce(
      (s, a, i) => s + (a === currentQuestions[i]?.answer ? 1 : 0),
      0
    );
  }, [submitted, answers, currentQuestions]);

  const percentage = useMemo(
    () => Math.round((score / currentQuestions.length) * 100),
    [score, currentQuestions.length]
  );

  const canEarnReward = useMemo(() => {
    if (!selectedLevel) return false;
    return percentage >= QUIZ_LEVELS[selectedLevel.toUpperCase()].requiredScore;
  }, [percentage, selectedLevel]);

  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  const handleQuizComplete = (levelId, score) => {
    const percentage = Math.round(score * 100);
    saveProgress(levelId, percentage);
    setProgress(getStoredProgress());
  };

  function selectLevel(levelId) {
    const level = QUIZ_LEVELS[levelId.toUpperCase()];
    if (!level) return;

    setSelectedLevel(levelId);
    setCurrentQuestions(level.questions);
    setAnswers(Array(level.questions.length).fill(null));
    setSubmitted(false);
    setShowResults(false);
    setMintError(null);
    setMintSuccess(false);
    setMintTx(null);
  }

  function pickAnswer(questionIndex, optionIndex) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  }

  function clearAnswer(questionIndex) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = null;
    setAnswers(newAnswers);
  }

  function submitQuiz() {
    setSubmitted(true);
    setShowResults(true);

    // Update progress
    const updatedProgress = quizProgress.updateLevelProgress(
      selectedLevel,
      score,
      currentQuestions.length
    );

    setProgress((prev) => ({
      ...prev,
      [selectedLevel]: updatedProgress,
    }));
  }

  function resetQuiz() {
    setAnswers(Array(currentQuestions.length).fill(null));
    setSubmitted(false);
    setShowResults(false);
    setMintError(null);
    setMintSuccess(false);
    setMintTx(null);
  }

  function backToLevels() {
    setSelectedLevel(null);
    setCurrentQuestions([]);
    setAnswers([]);
    setSubmitted(false);
    setShowResults(false);
    setMintError(null);
    setMintSuccess(false);
    setMintTx(null);
  }

  // Get the next level ID
  const getNextLevelId = (currentLevelId) => {
    const levels = Object.keys(QUIZ_LEVELS);
    const currentIndex = levels.findIndex(
      (id) => id.toLowerCase() === currentLevelId
    );
    return currentIndex < levels.length - 1
      ? levels[currentIndex + 1].toLowerCase()
      : null;
  };

  // Move to next level function
  function moveToNextLevel() {
    const nextLevelId = getNextLevelId(selectedLevel);
    if (nextLevelId) {
      selectLevel(nextLevelId);
    }
  }

  async function handleMintReward() {
    if (!address || !canEarnReward) return;

    setMinting(true);
    setMintError(null);
    try {
      const result = await mintQuizBadge({
        score,
        totalQuestions: currentQuestions.length,
        level: selectedLevel,
        toAddress: address,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }
      setMintSuccess(true);
      setMintTx(result.txHash);
    } catch (error) {
      setMintError(error.message);
    } finally {
      setMinting(false);
    }
  }

  // Level Selection View
  if (!selectedLevel) {
    const overallProgress = quizProgress.getOverallProgress();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#00FF66] mb-2">
            Quiz Levels
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(QUIZ_LEVELS).map(([levelId, level]) => {
            const levelKey = levelId.toLowerCase();
            const levelProgress =
              progress[levelKey] || quizProgress.getLevelProgress(levelKey);
            const isCompleted = levelProgress.completed;

            return (
              <div
                key={levelId}
                className="terminal-window p-6 transition-all duration-200 cursor-pointer hover:border-emerald-500/40 hover:bg-black/60"
                onClick={() => selectLevel(levelKey)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {level.name}
                  </h3>
                  <div className="flex gap-2">
                    {isCompleted && (
                      <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-emerald-100/70 mb-4">
                  {level.description}
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="text-cyan-300">
                      {level.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Score:</span>
                    <span className="text-cyan-300">
                      {level.requiredScore}%
                    </span>
                  </div>
                  {levelProgress.bestScore > 0 && (
                    <div className="flex justify-between">
                      <span>Best Score:</span>
                      <span
                        className={`${
                          levelProgress.bestScore >= level.requiredScore
                            ? "text-emerald-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {levelProgress.bestScore}%
                      </span>
                    </div>
                  )}
                  {progress.attempts > 0 && (
                    <div className="flex justify-between">
                      <span>Attempts:</span>
                      <span className="text-cyan-300">{progress.attempts}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz View
  const currentLevel = QUIZ_LEVELS[selectedLevel.toUpperCase()];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={backToLevels}
          className="text-cyan-300 hover:text-cyan-200 font-mono text-sm"
        >
          ← Back to Levels
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#00FF66]">
            {currentLevel.name} Quiz
          </h2>
          <p className="text-sm text-emerald-300/70">
            {currentLevel.description}
          </p>
        </div>
        <div className="text-sm font-mono">
          {currentQuestions.length} questions | {currentLevel.requiredScore}% to
          pass
        </div>
      </div>

      {/* Progress for current quiz */}
      {!submitted && (
        <div className="mb-6">
          <div className="flex justify-between text-sm font-mono mb-2">
            <span>Progress</span>
            <span>
              {answers.filter((a) => a !== null).length}/
              {currentQuestions.length}
            </span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (answers.filter((a) => a !== null).length /
                    currentQuestions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Questions */}
      {currentQuestions.map((question, qi) => {
        const picked = answers[qi];
        return (
          <div key={question.id} className="terminal-window relative">
            <div className="font-semibold mb-4 text-[#D0FFD0]">
              Q{qi + 1}. {question.question}
            </div>
            <div className="grid gap-3 mb-6">
              {question.options.map((option, oi) => {
                const chosen = picked === oi;
                const correct = submitted && oi === question.answer;
                const wrongChosen =
                  submitted && chosen && oi !== question.answer;

                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 rounded px-4 py-3 cursor-pointer border transition-all duration-200 ${
                      chosen
                        ? "border-[#00FF66] bg-[#00FF66]/10"
                        : "border-emerald-500/20 bg-black/20"
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
                      onChange={() => pickAnswer(qi, oi)}
                      disabled={submitted}
                    />
                    <span className="text-[#D0FFD0] font-mono">
                      {String.fromCharCode(65 + oi)}. {option}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Show explanation after submission */}
            {submitted && question.explanation && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
                <div className="text-sm text-emerald-300 font-mono mb-1">
                  <strong>Correct Answer:</strong>{" "}
                  {String.fromCharCode(65 + question.answer)}.{" "}
                  {question.options[question.answer]}
                </div>
                <div className="text-sm text-emerald-100/80">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>
            )}

            {/* Clear button */}
            {picked !== null && !submitted && (
              <div className="absolute bottom-2 right-4">
                <button
                  onClick={() => clearAnswer(qi)}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-mono cursor-pointer transition-colors duration-200 px-2"
                >
                  [clear]
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Results and Actions */}
      <div className="mt-8 space-y-4">
        {!submitted ? (
          <button
            onClick={submitQuiz}
            disabled={answers.some((a) => a === null)}
            className="terminal-btn px-6 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div
                className={`text-2xl font-bold font-mono ${
                  canEarnReward ? "text-emerald-400" : "text-yellow-400"
                }`}
              >
                Score: {score}/{currentQuestions.length} ({percentage}%)
              </div>
              <div
                className={`text-lg font-mono ${
                  canEarnReward ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {canEarnReward
                  ? "🎉 Congratulations! You passed!"
                  : `❌ You need ${currentLevel.requiredScore}% to pass`}
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              {canEarnReward && !mintSuccess && (
                <button
                  onClick={handleMintReward}
                  disabled={minting || !address}
                  className="terminal-btn px-6 py-3"
                >
                  {minting
                    ? "Minting Badge..."
                    : !address
                    ? "Connect Wallet to Claim Badge"
                    : "Claim Achievement Badge"}
                </button>
              )}
              {canEarnReward && getNextLevelId(selectedLevel) && (
                <button
                  onClick={moveToNextLevel}
                  className="terminal-btn px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30"
                >
                  Continue to Next Level →
                </button>
              )}
              <button onClick={resetQuiz} className="terminal-btn px-4 py-2">
                Try Again
              </button>
              <button onClick={backToLevels} className="terminal-btn px-4 py-2">
                Back to Levels
              </button>
            </div>
          </>
        )}
      </div>

      {/* Status Messages */}
      {!address && canEarnReward && !mintSuccess && (
        <div className="text-center text-yellow-400 font-mono">
          ⚠️ Connect your wallet to claim your achievement badge
        </div>
      )}

      {mintError && (
        <div className="text-center text-red-400 font-mono">
          Failed to mint badge: {mintError}
        </div>
      )}

      {mintSuccess && (
        <div className="text-center text-emerald-400 font-mono space-y-2">
          <div>🎉 Achievement badge claimed! Check your wallet.</div>
          {mintTx && (
            <div className="text-sm opacity-80">
              Transaction: <span className="text-cyan-300">{mintTx}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
