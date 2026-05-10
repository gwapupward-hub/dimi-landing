import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { trpc } from "@/lib/trpc";

interface Props {
  creatorId: number;
  walletAddress: string | null;
}

function shorten(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function WalletButton({ creatorId, walletAddress }: Props) {
  const { publicKey, connecting, connected, connect, disconnect, hasPhantom } = useWallet();
  const linkWallet = trpc.wallet.linkWallet.useMutation();
  const refreshScore = trpc.wallet.refreshGwapScore.useMutation();
  const [busy, setBusy] = useState(false);
  const utils = trpc.useUtils();

  const linkedAddress = walletAddress ?? publicKey;

  const handleConnect = async () => {
    setBusy(true);
    try {
      const pk = await connect();
      if (!pk) return;
      await linkWallet.mutateAsync({ creatorId, walletAddress: pk });
      await refreshScore.mutateAsync({ creatorId, walletAddress: pk });
      utils.profiles.getByHandle.invalidate();
    } catch (err) {
      console.warn("[wallet] connect failed", err);
    } finally {
      setBusy(false);
    }
  };

  if (linkedAddress) {
    return (
      <button
        onClick={() => {
          if (connected) disconnect();
        }}
        className="px-3 py-1.5 rounded-md border border-[#2EE62E]/40 bg-[#2EE62E]/10 text-[#2EE62E] text-xs font-mono"
        title={linkedAddress}
      >
        {shorten(linkedAddress)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={busy || connecting}
      className="px-3 py-1.5 rounded-md border border-white/15 bg-white/5 text-white/80 text-xs font-mono hover:border-[#2EE62E]/40 hover:text-[#2EE62E] transition disabled:opacity-40"
    >
      {busy || connecting
        ? "Connecting…"
        : hasPhantom
          ? "Connect Phantom"
          : "Install Phantom"}
    </button>
  );
}
