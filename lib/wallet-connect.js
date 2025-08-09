"use client"

export async function openWeb3Modal() {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  if (!projectId) {
    alert("WalletConnect Project ID missing. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.")
    return
  }

  const [{ createWeb3Modal, defaultWagmiConfig }, wagmiReact, chainsMod, wagmiCore] = await Promise.all([
    import("@web3modal/wagmi/react"),
    import("wagmi"),
    import("wagmi/chains"),
    import("wagmi"),
  ])

  const { WagmiProvider } = wagmiReact
  const { polygonAmoy } = chainsMod
  const { http } = wagmiCore

  const metadata = {
    name: "Bug Slayer Arena",
    description: "Retro terminal coding challenges",
    url: typeof window !== "undefined" ? window.location.origin : "http://localhost",
    icons: ["/placeholder.svg?height=64&width=64"],
  }

  const chains = [polygonAmoy]
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    transports: { [polygonAmoy.id]: http() },
  })
  createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: "dark" })

  alert("Web3Modal initialized. Integrate Wagmi hooks/UI for full flow.")
}
