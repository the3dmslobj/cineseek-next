"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import PosterCard, { type PosterItem } from "./PosterCard";

export default function HRow({ items }: { items: PosterItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative">
      <div
        ref={ref}
        className="h-scroll flex gap-4 overflow-x-auto pb-2"
      >
        {items.map((it) => (
          <div key={`${it.type ?? "movie"}-${it.id}`} style={{ width: 180, flexShrink: 0 }}>
            <PosterCard item={it} />
          </div>
        ))}
      </div>
      <div className="hidden md:flex justify-end gap-2 mt-3">
        <button
          onClick={() => ref.current?.scrollBy({ left: -600, behavior: "smooth" })}
          className="btn-icon"
          aria-label="scroll left"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          onClick={() => ref.current?.scrollBy({ left: 600, behavior: "smooth" })}
          className="btn-icon"
          aria-label="scroll right"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
