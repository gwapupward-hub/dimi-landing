import { trpc } from "@/lib/trpc";
import { StemPlayer } from "./StemPlayer";

interface Props {
  sessionId: number;
}

export function StemList({ sessionId }: Props) {
  const { data, isLoading } = trpc.uploads.listStems.useQuery({ sessionId });

  if (isLoading) {
    return <p className="text-white/40 text-xs">Loading stems…</p>;
  }
  if (!data || data.length === 0) {
    return <p className="text-white/40 text-xs">No stems uploaded yet.</p>;
  }

  return (
    <div className="space-y-2">
      {data.map(stem => (
        <StemPlayer key={stem.id} name={stem.name} url={stem.s3Url} />
      ))}
    </div>
  );
}
