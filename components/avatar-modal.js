"use client"

import { useWallet } from "@/lib/wallet"
import { mintAvatar } from "@/lib/mint-avatar"
import { TerminalModal } from "@/components/terminal-modal"

export function AvatarModal({ open, onOpenChange, avatar }) {
  const { address, connect } = useWallet()
  if (!avatar) return null

  return (
    <TerminalModal open={open} onOpenChange={onOpenChange} title={avatar.name}>
      <div className="space-y-3">
        <img src={avatar.image || "/placeholder.svg"} alt={avatar.name} className="w-full rounded-md" />
        <div
          className="text-xs capitalize inline-block px-2 py-0.5 rounded
          bg-emerald-500/20 text-emerald-200
          "
          style={{
            background:
              avatar.rarity === "epic"
                ? "rgba(217,70,239,.2)"
                : avatar.rarity === "rare"
                  ? "rgba(6,182,212,.2)"
                  : "rgba(16,185,129,.2)",
            color: avatar.rarity === "epic" ? "#f5d0fe" : avatar.rarity === "rare" ? "#a5f3fc" : "#bbf7d0",
          }}
        >
          {avatar.rarity}
        </div>
        <p className="text-sm text-neutral-300">
          A legendary champion of the Arena. Mint this avatar as an ERC-721 NFT.
        </p>

        {!address ? (
          <button
            onClick={connect}
            className="w-full px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 transition-colors"
          >
            [Connect Wallet]
          </button>
        ) : (
          <button
            onClick={async () => {
              const { ok, txHash, error } = await mintAvatar({ avatar })
              if (ok) {
                onOpenChange(false)
                alert(`Minted! Tx: ${txHash}`)
              } else {
                alert(`Mint failed: ${error ?? "unknown error"}`)
              }
            }}
            className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Mint Avatar
          </button>
        )}

        <p className="text-xs text-neutral-400">
          mint is mocked unless you configure NEXT_PUBLIC_AVATAR_CONTRACT
        </p>
      </div>
    </TerminalModal>
  )
}
