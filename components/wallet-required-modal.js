"use client";

import { useWallet } from "@/lib/wallet";
import { TerminalModal } from "@/components/terminal-modal";

export function WalletRequiredModal({ open, onOpenChange }) {
  const { connect } = useWallet();

  return (
    <TerminalModal
      open={open}
      onOpenChange={onOpenChange}
      title="authentication required"
    >
      <div className="space-y-4">
        <p className="text-sm">Connect your wallet to access this section.</p>
        <p className="text-xs text-gray-400">
          Ensure Testnet mode is enabled
        </p>
        <button
          onClick={async () => {
            await connect();
            onOpenChange(false);
          }}
          className="w-full px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          [connect wallet]
        </button>
      </div>
    </TerminalModal>
  );
}
