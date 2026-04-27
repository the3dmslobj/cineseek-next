export default function SectionLabel({
  idx,
  label,
  count,
}: {
  idx: number;
  label: string;
  count?: number;
}) {
  return (
    <div
      className="flex items-baseline justify-between mb-5 pb-3 border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-baseline gap-4">
        <span className="cap">§ {String(idx).padStart(2, "0")}</span>
        <h2 className="display text-2xl md:text-4xl">{label}</h2>
      </div>
      {count != null && (
        <span className="cap">[{String(count).padStart(3, "0")} ITEMS]</span>
      )}
    </div>
  );
}
