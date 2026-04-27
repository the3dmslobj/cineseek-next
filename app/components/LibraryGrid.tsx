"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PosterCard, { type PosterItem } from "./PosterCard";
import {
  listLibrary,
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";

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
  const [items, setItems] = useState<PosterItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await listLibrary(status);
      const fetched = await Promise.all(
        entries.map((e) => fetchTitle(e.movie_id, e.media_type)),
      );
      if (!cancelled) {
        setItems(fetched.filter((c): c is PosterItem => c !== null));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (items === null) return <div className="cap">// loading...</div>;

  if (items.length === 0) {
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((m) => (
        <PosterCard key={`${m.type}-${m.id}`} item={m} />
      ))}
    </div>
  );
}
