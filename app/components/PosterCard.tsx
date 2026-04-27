import Link from "next/link";
import { TMDB_IMG, FALLBACK_POSTER } from "@/lib/tmdb";

export type PosterItem = {
  id: number;
  title: string;
  year?: string | number;
  rating?: number;
  type?: "movie" | "tv";
  poster_path?: string | null;
};

export default function PosterCard({
  item,
  href,
}: {
  item: PosterItem;
  href?: string;
}) {
  const linkHref = href ?? `/details/${item.type ?? "movie"}/${item.id}`;
  const code = String(item.id).padStart(4, "0");
  const typeLabel = item.type === "tv" ? "SER" : "FLM";

  return (
    <Link href={linkHref} className="pcard">
      <div className="poster">
        <img
          src={item.poster_path ? `${TMDB_IMG}${item.poster_path}` : FALLBACK_POSTER}
          alt={item.title}
        />
        <span className="corner c-tl">{code}</span>
        {item.year != null && <span className="corner c-tr">{item.year}</span>}
        <span className="corner c-bl">{typeLabel}</span>
        {item.rating != null && (
          <span className="corner c-br">★ {item.rating.toFixed(1)}</span>
        )}
      </div>
      <div className="meta flex items-center justify-between gap-2">
        <span className="text-[12px] truncate" style={{ color: "var(--ink)" }}>
          {item.title}
        </span>
        {item.year != null && (
          <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
            {item.year}
          </span>
        )}
      </div>
    </Link>
  );
}
