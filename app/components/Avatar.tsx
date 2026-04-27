type Props = {
  name: string;
  size?: number;
};

function initials(name: string) {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Avatar({ name, size = 32 }: Props) {
  const text = initials(name);
  const fontSize = Math.max(10, Math.round(size * 0.4));
  return (
    <div
      className="flex items-center justify-center font-mono font-bold uppercase frame"
      style={{
        width: size,
        height: size,
        fontSize,
        color: "var(--ink)",
        background: "var(--panel)",
      }}
      aria-label={name}
    >
      {text}
    </div>
  );
}
