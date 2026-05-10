export function ViewerCount({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#3DD6C8] font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_#3DD6C8]" />
      {count.toLocaleString()} watching
    </span>
  );
}
