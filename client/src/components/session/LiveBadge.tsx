export function LiveBadge({ isLive }: { isLive: boolean }) {
  if (!isLive) return null;
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2EE62E]/10 border border-[#2EE62E]/40 text-[#2EE62E] text-xs font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2EE62E] animate-pulse" />
      Live
    </span>
  );
}
