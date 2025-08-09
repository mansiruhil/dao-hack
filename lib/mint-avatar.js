import { saveMintedAvatar } from "./storage-game"
import { BrowserProvider, Contract } from "ethers"

const AVATAR_ABI = [
  "function mintAvatar(address to, uint256 avatarId) public returns (uint256 tokenId)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
]

function randomTxHash() {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return "0x" + hex
}

export async function mintAvatar({ avatar }) {
  const contractAddr = process.env.NEXT_PUBLIC_AVATAR_CONTRACT
  const anyEth = typeof window !== "undefined" ? window.ethereum : undefined

  if (contractAddr && anyEth) {
    try {
      const provider = new BrowserProvider(anyEth)
      const signer = await provider.getSigner()
      const contract = new Contract(contractAddr, AVATAR_ABI, signer)
      const to = await signer.getAddress()
      const tx = await contract.mintAvatar(to, avatar.id)
      const receipt = await tx.wait()
      const txHash = (receipt && receipt.hash) || (tx && tx.hash)

      const tokenId = Math.floor(Math.random() * 1_000_000)
      saveMintedAvatar({
        tokenId,
        name: avatar.name,
        rarity: avatar.rarity,
        level: avatar.metadata.level,
        created_at: avatar.metadata.created_at,
        image: avatar.image,
        owner: to,
        txHash,
      })
      return { ok: true, txHash }
    } catch (e) {
      return { ok: false, error: e && e.message ? e.message : "wallet error" }
    }
  }

  try {
    const to =
      typeof window !== "undefined"
        ? await (
            window.ethereum &&
            window.ethereum.request &&
            window.ethereum.request({ method: "eth_requestAccounts" })
          ).then((a) => a && a[0])
        : "0xMOCK"
    const tokenId = Math.floor(Math.random() * 1_000_000)
    const txHash = randomTxHash()
    saveMintedAvatar({
      tokenId,
      name: avatar.name,
      rarity: avatar.rarity,
      level: avatar.metadata.level,
      created_at: avatar.metadata.created_at,
      image: avatar.image,
      owner: to || "0xMOCK",
      txHash,
    })
    return { ok: true, txHash }
  } catch (e) {
    return { ok: false, error: e && e.message ? e.message : "mock mint failed" }
  }
}
