import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { saveBadge } from "@/lib/storage-badges";
import bs58 from "bs58";

// Initialize connection to devnet
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

// Define reward amounts based on score
function getRewardAmount(percentage) {
  if (percentage >= 90) return LAMPORTS_PER_SOL / 50; // 0.02 SOL for 90%+
  if (percentage >= 80) return LAMPORTS_PER_SOL / 100; // 0.01 SOL for 80%+
  return LAMPORTS_PER_SOL / 200; // 0.005 SOL for 70%+
}

export async function mintQuizBadge({
  score,
  totalQuestions,
  level,
  toAddress,
}) {
  if (!process.env.SOLANA_TREASURY_PRIVATE_KEY) {
    return { ok: false, error: "Treasury not configured" };
  }

  try {
    if (!toAddress) {
      return { ok: false, error: "Connect wallet first" };
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const rewardAmount = getRewardAmount(percentage);

    // Create treasury wallet from base58 private key
    const treasuryPrivateKey = bs58.decode(
      process.env.SOLANA_TREASURY_PRIVATE_KEY
    );
    const treasuryWallet = Keypair.fromSecretKey(treasuryPrivateKey);

    // Validate treasury has enough balance
    const treasuryBalance = await connection.getBalance(
      treasuryWallet.publicKey
    );
    if (treasuryBalance < rewardAmount) {
      return { ok: false, error: "Treasury needs funding" };
    }

    // Convert recipient address string to PublicKey
    let recipientPubKey;
    try {
      recipientPubKey = new PublicKey(toAddress);
    } catch {
      return { ok: false, error: "Invalid recipient address" };
    }
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasuryWallet.publicKey,
        toPubkey: recipientPubKey,
        lamports: rewardAmount,
      })
    );

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = treasuryWallet.publicKey;

    // Send and confirm
    const signature = await connection.sendTransaction(
      transaction,
      [treasuryWallet],
      { preflightCommitment: "confirmed" }
    );

    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed"
    );
    if (confirmation.value.err) {
      throw new Error(
        "Transaction failed: " + JSON.stringify(confirmation.value.err)
      );
    }

    // Save badge info
    saveBadge({
      quizScore: percentage,
      owner: toAddress,
      txHash: signature,
      date: new Date().toISOString(),
      reward: rewardAmount / LAMPORTS_PER_SOL + " SOL",
      type: "quiz",
      level: level,
    });

    return {
      ok: true,
      txHash: signature,
      rewardAmount: rewardAmount / LAMPORTS_PER_SOL,
    };
  } catch (error) {
    console.error("Quiz reward transfer error:", error);
    return {
      ok: false,
      error:
        error?.message ||
        "Failed to send reward. Make sure you're on Solana devnet.",
    };
  }
}
