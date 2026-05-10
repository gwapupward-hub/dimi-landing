const TIER_CONFIG = {
  elite: { label: "Elite", color: "#FFD700" },
  verified: { label: "Verified", color: "#2EE62E" },
  rising: { label: "Rising", color: "#3DD6C8" },
  new: { label: "New", color: "#FFFFFF" },
} as const;

interface Props {
  score: number | null;
  tier: string | null;
  loading?: boolean;
}

export function GwapScoreBadge({ score, tier, loading }: Props) {
  if (loading) {
    return <div className="h-8 w-24 bg-white/10 animate-pulse rounded-full" />;
  }
  if (score == null) return null;

  const cfg =
    (tier ? TIER_CONFIG[tier as keyof typeof TIER_CONFIG] : null) ?? TIER_CONFIG.new;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
      style={{
        borderColor: `${cfg.color}40`,
        color: cfg.color,
        backgroundColor: `${cfg.color}10`,
      }}
    >
      <span className="font-mono text-sm">{score}</span>
      <span className="opacity-70">{cfg.label}</span>
    </div>
  );
}
