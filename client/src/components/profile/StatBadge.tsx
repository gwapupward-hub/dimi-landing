interface Props {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatBadge({ label, value, accent }: Props) {
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${accent ? "text-[#2EE62E]" : "text-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-white/40 text-xs">{label}</p>
    </div>
  );
}
