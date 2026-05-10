import { useState } from "react";
import {
  generateSplitPdf,
  type Contributor,
  type Release,
} from "@/lib/generateSplitPdf";
import { trpc } from "@/lib/trpc";
import { useWallet } from "@/hooks/useWallet";
import {
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";

interface Props {
  release: Release;
  contributors: Contributor[];
  releaseId: number;
}

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined) ??
  "https://api.mainnet-beta.solana.com";

type Status = "idle" | "generating" | "signing" | "done" | "error";

export function ExportButton({ release, contributors, releaseId }: Props) {
  const { publicKey, signTransaction, connected, connect } = useWallet();
  const [status, setStatus] = useState<Status>("idle");
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recordAttestation = trpc.attestation.record.useMutation();

  const allSigned = contributors.every(c => c.signed);

  const handleExport = async () => {
    setStatus("generating");
    setErrorMessage(null);
    try {
      const { blob, hash } = await generateSplitPdf(release, contributors);

      // Download PDF locally
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${release.title.replace(/[^a-z0-9-_]/gi, "_")}-split-sheet.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      let signature: string | undefined;

      // On-chain attestation via Solana Memo (only if Phantom is connected)
      if (connected && publicKey) {
        setStatus("signing");
        const connection = new Connection(RPC, "confirmed");
        const { blockhash } = await connection.getLatestBlockhash();

        const memoIx = new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(`dimi:split:${releaseId}:${hash}`, "utf8"),
        });

        const tx = new Transaction({
          recentBlockhash: blockhash,
          feePayer: new PublicKey(publicKey),
        });
        tx.add(memoIx);

        const signed = await signTransaction(tx);
        const sig = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(sig, "confirmed");

        signature = sig;
        setTxSig(sig);
      }

      await recordAttestation.mutateAsync({
        releaseId,
        documentHash: hash,
        txSignature: signature,
      });

      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  const buttonLabel = (() => {
    switch (status) {
      case "generating":
        return "Generating PDF…";
      case "signing":
        return "Signing on-chain…";
      case "done":
        return "✓ Exported & Attested";
      case "error":
        return "Error — retry";
      default:
        return allSigned
          ? connected
            ? "Export Split Sheet + Attest"
            : "Export Split Sheet"
          : "All contributors must sign first";
    }
  })();

  return (
    <div className="space-y-3">
      <button
        onClick={handleExport}
        disabled={!allSigned || status === "generating" || status === "signing"}
        className="w-full py-3 rounded-xl bg-[#2EE62E] text-black font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#26c926] transition"
      >
        {buttonLabel}
      </button>
      {!connected && allSigned && (
        <button
          onClick={() => connect().catch(() => {})}
          className="w-full py-2 rounded-xl border border-white/15 text-white/70 text-xs hover:border-[#2EE62E]/40 hover:text-[#2EE62E] transition"
        >
          Connect Phantom to attest on Solana
        </button>
      )}
      {txSig && (
        <p className="text-xs text-white/40 text-center">
          Tx:{" "}
          <a
            href={`https://solscan.io/tx/${txSig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2EE62E] underline"
          >
            {txSig.slice(0, 16)}…
          </a>
        </p>
      )}
      {errorMessage && status === "error" && (
        <p className="text-xs text-red-400 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
