"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useCarousel } from "@/lib/carousel";
import { TMDB_IMG } from "@/lib/tmdb";

type Movie = { id: number; poster_path?: string };

const CARD_WIDTH = 160;
const CARD_GAP = 20;

export default function NowPlayingCarousel({ movies }: { movies: Movie[] }) {
  const [screenWidth, setScreenWidth] = useState(1280);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cardCount =
    screenWidth >= 1280 ? 6 : screenWidth >= 1024 ? 5 : screenWidth >= 768 ? 4 : 3;

  const maxIndex = Math.max(0, movies.length - cardCount);
  const { index, next, prev } = useCarousel({
    itemCount: maxIndex + 1,
    intervalMs: 3000,
  });

  if (screenWidth <= 768) return null;

  const stride = CARD_WIDTH + CARD_GAP;
  const viewportWidth = cardCount * stride;

  return (
    <div className="w-full">
      <div className="my-1 md:my-6 mt-5 md:mt-12 mx-5 md:mx-16 lg:mx-20 xl:mx-24 text-3xl md:text-5xl font-bold text-color4 font-raleway">
        Now Playing.
      </div>
      <div className="mx-auto flex items-center rounded">
        {screenWidth >= 1280 && (
          <button
            className="mr-7.5 hover:text-color4 text-color3"
            onClick={prev}
            aria-label="previous"
          >
            <FontAwesomeIcon size="2x" icon={faChevronLeft} />
          </button>
        )}
        <div
          className="my-7 rounded overflow-hidden shrink-0"
          style={{ width: `${viewportWidth}px` }}
        >
          <div
            className="flex flex-nowrap transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * stride}px)` }}
          >
            {movies.map((movie) =>
              movie.poster_path ? (
                <Link
                  key={movie.id}
                  href={`/details/movie/${movie.id}`}
                  className="mx-2.5 shrink-0"
                  style={{ width: `${CARD_WIDTH}px` }}
                >
                  <img
                    src={`${TMDB_IMG}${movie.poster_path}`}
                    alt=""
                    className="rounded cursor-pointer w-full"
                    loading="lazy"
                  />
                </Link>
              ) : null,
            )}
          </div>
        </div>
        {screenWidth >= 1280 && (
          <button
            className="ml-7.5 text-color3 hover:text-color4"
            onClick={next}
            aria-label="next"
          >
            <FontAwesomeIcon size="2x" icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
}
