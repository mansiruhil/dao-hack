import { BrowserProvider, Contract } from "ethers"
import { saveBadge } from "@/lib/storage-badges"

const BADGE_ABI = [
  "function mintBadge(address to, string challengeId) public returns (uint256 tokenId)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]

function randomTxHash() {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return "0x" + hex
}

export async function mintBadge({ challengeId, title, toAddress, difficulty }) {
  const contractAddr = process.env.NEXT_PUBLIC_BADGE_CONTRACT
  const anyEth = typeof window !== "undefined" ? window.ethereum : undefined

  // on chain mint if contract + wallet present
  if (contractAddr && anyEth) {
    try {
      const provider = new BrowserProvider(anyEth)
      const signer = await provider.getSigner()
      const to = toAddress || (await signer.getAddress())
      const contract = new Contract(contractAddr, BADGE_ABI, signer)
      const tx = await contract.mintBadge(to, String(challengeId))
      const receipt = await tx.wait()
      const txHash = (receipt && receipt.hash) || tx.hash

      saveBadge({
        challengeId,
        title,
        difficulty,
        owner: to,
        txHash,
        date: new Date().toISOString(),
      })

      return { ok: true, txHash }
    } catch (e) {
      return { ok: false, error: e?.message || "wallet error" }
    }
  }

  try {
    const txHash = randomTxHash()
    saveBadge({
      challengeId,
      title,
      difficulty,
      owner: toAddress || "0xMOCK",
      txHash,
      date: new Date().toISOString(),
    })
    return { ok: true, txHash }
  } catch (e) {
    return { ok: false, error: e?.message || "mock mint failed" }
  }
}
