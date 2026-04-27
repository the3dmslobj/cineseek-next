"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TMDB_IMG, FALLBACK_POSTER } from "@/lib/tmdb";

export type HeroItem = {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  year: string;
  rating: number;
  tagline?: string;
  runtime?: string;
  genres: string[];
  director?: string;
};

export default function TrendingHero({ items }: { items: HeroItem[] }) {
  const [hi, setHi] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setHi((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const item = items[hi];
  const code = String(item.id).padStart(4, "0");

  return (
    <section
      className="noise border-b flex flex-col flex-1"
      style={{ borderColor: "var(--line)" }}
    >
      <div
        className="max-w-400 mx-auto w-full px-5 md:px-8 grid md:grid-cols-12 gap-6 py-10 md:py-16 flex-1"
      >
        <div className="md:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="tag accent">FEATURED</span>
            <span className="cap">
              ENTRY_{String(hi + 1).padStart(3, "0")}/{items.length}
            </span>
          </div>
          <h1
            className="display text-[clamp(48px,8vw,128px)] mb-6"
            style={{ minHeight: "2em" }}
          >
            {item.title}.
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-xl mb-6"
            style={{ color: "var(--ink-2)", minHeight: "5em" }}
          >
            {item.overview}
          </p>
          <div className="flex flex-wrap gap-2 mb-6" style={{ minHeight: 36 }}>
            {item.genres.map((g) => (
              <span key={g} className="tag">
                {g}
              </span>
            ))}
            <span className="tag">★ {item.rating.toFixed(1)}</span>
            <span className="tag">{item.year}</span>
            {item.runtime && <span className="tag">{item.runtime}</span>}
          </div>
          <div className="flex gap-3 mt-auto">
            <Link href={`/details/movie/${item.id}`} className="btn btn-primary">
              View entry →
            </Link>
            <Link href="/results?type=movie&query=" className="btn">
              Browse all
            </Link>
          </div>
        </div>
        <div className="md:col-span-4">
          <div
            className="frame p-3"
            style={{ background: "var(--panel)" }}
          >
            <div className="poster">
              <img
                src={
                  item.poster_path
                    ? `${TMDB_IMG}${item.poster_path}`
                    : FALLBACK_POSTER
                }
                alt={item.title}
              />
              <span className="corner c-tl">{code}</span>
              <span className="corner c-tr">{item.year}</span>
              <span className="corner c-bl">FLM</span>
              <span className="corner c-br">★ {item.rating.toFixed(1)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div>
                <div style={{ color: "var(--ink-3)" }}>DIR</div>
                <div className="truncate">{item.director ?? "—"}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>YR</div>
                <div>{item.year}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>RUN</div>
                <div>{item.runtime ?? "—"}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>RAT</div>
                <div className="text-accent">★ {item.rating.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-400 mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setHi(i)}
                className="cap px-2 py-1"
                style={{
                  background: i === hi ? "var(--accent)" : "transparent",
                  color: i === hi ? "var(--accent-ink)" : "var(--ink-3)",
                  border:
                    "1px solid " + (i === hi ? "var(--accent)" : "var(--line)"),
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <span className="cap">AUTO-CYCLE 7s</span>
        </div>
      </div>
    </section>
  );
}
