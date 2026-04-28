"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PosterCard, { type PosterItem } from "./PosterCard";
import {
  listLibrary,
  type LibraryEntry,
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";

type WithEntry = { item: PosterItem; entry: LibraryEntry };

async function fetchTitle(
  id: number,
  mediaType: MediaType,
): Promise<PosterItem | null> {
  const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
    {
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id,
    type: mediaType,
    title: data.title || data.name || "Untitled",
    poster_path: data.poster_path,
    rating: data.vote_average,
    year: (data.release_date || data.first_air_date || "").slice(0, 4) || undefined,
  };
}

export default function LibraryGrid({
  status,
  emptyText,
  emptyHeading,
}: {
  status: LibraryStatus;
  emptyText: string;
  emptyHeading: string;
}) {
  const [rows, setRows] = useState<WithEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await listLibrary(status);
      const fetched = await Promise.all(
        entries.map(async (e) => {
          const item = await fetchTitle(e.movie_id, e.media_type);
          return item ? { item, entry: e } : null;
        }),
      );
      if (!cancelled) {
        setRows(fetched.filter((r): r is WithEntry => r !== null));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (rows === null) return <div className="cap">// loading...</div>;

  if (rows.length === 0) {
    return (
      <div
        className="frame p-12 md:p-20 text-center"
        style={{ background: "var(--panel)" }}
      >
        <div className="cap mb-4">// EMPTY_SET</div>
        <h3 className="display text-3xl md:text-5xl mb-3">{emptyHeading}</h3>
        <p
          className="text-sm mb-6 max-w-md mx-auto"
          style={{ color: "var(--ink-2)" }}
        >
          {emptyText}
        </p>
        <Link href="/" className="btn btn-primary">
          Browse catalogue →
        </Link>
      </div>
    );
  }

  const showNotes = status === "watched";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {rows.map(({ item, entry }) => (
        <div key={`${item.type}-${item.id}`} className="flex flex-col gap-2">
          <PosterCard item={item} />
          {showNotes && entry.note && (
            <Link
              href={`/details/${item.type}/${item.id}`}
              className="frame p-2 text-[11px] leading-relaxed line-clamp-3"
              style={{
                background: "var(--panel)",
                color: "var(--ink-2)",
              }}
              title={entry.note}
            >
              <span
                className="cap block mb-1"
                style={{ color: "var(--ink-3)" }}
              >
                // note
              </span>
              {entry.note}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
