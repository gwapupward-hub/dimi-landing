import { trpc } from "@/lib/trpc";

export function AttestationStatus({ releaseId }: { releaseId: number }) {
  const { data } = trpc.attestation.getByRelease.useQuery({ releaseId });

  if (!data || data.length === 0) {
    return (
      <p className="text-white/40 text-xs">No attestations recorded yet.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {data.map(a => (
        <li
          key={a.id}
          className="flex items-center justify-between px-3 py-2 rounded border border-white/10 bg-black/40 text-xs"
        >
          <div>
            <div className="text-white/80 font-mono">
              {a.documentHash.slice(0, 16)}…
            </div>
            <div className="text-white/40">
              {new Date(a.attestedAt).toLocaleString()} · {a.network}
            </div>
          </div>
          {a.txSignature && (
            <a
              href={`https://solscan.io/tx/${a.txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2EE62E] underline"
            >
              View tx
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
