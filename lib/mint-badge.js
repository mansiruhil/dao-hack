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

// Amount to send for each completion (0.01 SOL - small enough for testing)
const REWARD_AMOUNT = LAMPORTS_PER_SOL / 100;

export async function mintBadge({ challengeId, title, toAddress, difficulty }) {
  if (!process.env.SOLANA_TREASURY_PRIVATE_KEY) {
    return { ok: false, error: "Treasury not configured" };
  }

  try {
    if (!toAddress || toAddress === "0xMOCK") {
      return { ok: false, error: "Connect wallet first" };
    }

    // Create treasury wallet from base58 private key
    const treasuryPrivateKey = bs58.decode(process.env.SOLANA_TREASURY_PRIVATE_KEY);
    const treasuryWallet = Keypair.fromSecretKey(treasuryPrivateKey);

    // Validate treasury has enough balance
    const treasuryBalance = await connection.getBalance(
      treasuryWallet.publicKey
    );
    if (treasuryBalance < REWARD_AMOUNT) {
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
        lamports: REWARD_AMOUNT,
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

    // Save badge info locally
    saveBadge({
      challengeId,
      title,
      difficulty,
      owner: toAddress,
      txHash: signature,
      date: new Date().toISOString(),
      reward: REWARD_AMOUNT / LAMPORTS_PER_SOL + " SOL",
    });

    return { ok: true, txHash: signature };
  } catch (e) {
    console.error("Solana transfer error:", e);
    return {
      ok: false,
      error:
        e?.message ||
        "Failed to send reward. Make sure you're on Solana devnet.",
    };
  }
}
