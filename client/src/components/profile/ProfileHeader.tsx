import { GwapScoreBadge } from "./GwapScoreBadge";
import { WalletButton } from "./WalletButton";

interface Creator {
  id: number;
  name: string;
  handle: string | null;
  genre: string | null;
  followers: number;
  isLive: number;
  bio: string | null;
  gwapScore: number | null;
  walletAddress: string | null;
}

export function ProfileHeader({ creator }: { creator: Creator }) {
  const isLive = creator.isLive === 1;
  return (
    <div className="border-b border-white/10 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12 flex items-end gap-8">
        <div className="w-20 h-20 rounded-full bg-[#2EE62E]/20 flex items-center justify-center text-2xl font-bold text-[#2EE62E]">
          {creator.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
            {isLive && (
              <span className="px-2 py-0.5 rounded-full bg-[#2EE62E]/10 border border-[#2EE62E]/30 text-[#2EE62E] text-xs font-bold uppercase tracking-wider">
                Live
              </span>
            )}
            <GwapScoreBadge
              score={creator.gwapScore}
              tier={tierFromScore(creator.gwapScore)}
              loading={false}
            />
          </div>
          {creator.handle && (
            <p className="text-white/40 text-sm mt-0.5">@{creator.handle}</p>
          )}
          {creator.genre && (
            <p className="text-white/60 text-sm mt-1">{creator.genre}</p>
          )}
          {creator.bio && (
            <p className="text-white/50 text-sm mt-3 max-w-xl">{creator.bio}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xl font-bold text-white">
                {creator.followers.toLocaleString()}
              </p>
              <p className="text-white/40 text-xs">Followers</p>
            </div>
            {creator.gwapScore != null && (
              <div>
                <p className="text-xl font-bold text-[#2EE62E]">
                  {creator.gwapScore}
                </p>
                <p className="text-white/40 text-xs">GwapScore</p>
              </div>
            )}
          </div>
          <WalletButton creatorId={creator.id} walletAddress={creator.walletAddress} />
        </div>
      </div>
    </div>
  );
}

function tierFromScore(score: number | null): "elite" | "verified" | "rising" | "new" | null {
  if (score == null) return null;
  if (score >= 800) return "elite";
  if (score >= 500) return "verified";
  if (score >= 200) return "rising";
  return "new";
}
