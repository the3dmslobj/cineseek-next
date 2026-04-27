"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  listLibrary,
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";
import { TMDB_IMG } from "@/lib/tmdb";

type Card = {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path?: string;
  vote_average?: number;
};

async function fetchTitle(id: number, mediaType: MediaType): Promise<Card | null> {
  const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
    { headers: { accept: "application/json", Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id,
    media_type: mediaType,
    title: data.title || data.name || "Untitled",
    poster_path: data.poster_path,
    vote_average: data.vote_average,
  };
}

export default function LibraryGrid({
  status,
  emptyText,
}: {
  status: LibraryStatus;
  emptyText: string;
}) {
  const [cards, setCards] = useState<Card[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await listLibrary(status);
      const fetched = await Promise.all(
        entries.map((e) => fetchTitle(e.movie_id, e.media_type))
      );
      if (!cancelled) {
        setCards(fetched.filter((c): c is Card => c !== null));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (cards === null) return <div className="text-color2 mb-10">Loading...</div>;
  if (cards.length === 0) return <div className="text-color2 mb-10">{emptyText}</div>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-10">
      {cards.map((c) => (
        <Link
          href={`/details/${c.media_type}/${c.id}`}
          key={`${c.media_type}-${c.id}`}
          className="relative cursor-pointer"
        >
          <img
            src={
              c.poster_path
                ? `${TMDB_IMG}${c.poster_path}`
                : "https://dummyimage.com/600x900/000000/000000.png"
            }
            alt=""
            className="w-full shrink-0 rounded block h-auto"
          />
          <div
            className="absolute bottom-2 right-2 text-xs md:text-sm font-bold p-1 text-color4 rounded"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.497)" }}
          >
            <FontAwesomeIcon icon={faStar} className="mr-1" />
            {c.vote_average ? Number(c.vote_average.toFixed(1)) : ""}
          </div>
        </Link>
      ))}
    </div>
  );
}
