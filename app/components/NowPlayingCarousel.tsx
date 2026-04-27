"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { setupCarousel, type CarouselControls } from "@/lib/carousel";
import { TMDB_IMG } from "@/lib/tmdb";

type Movie = { id: number; poster_path?: string };

export default function NowPlayingCarousel({ movies }: { movies: Movie[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [controls, setControls] = useState<CarouselControls | null>(null);
  const [screenWidth, setScreenWidth] = useState(1280);
  const [cardWidth, setCardWidth] = useState(160);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getCardCount = () => {
    if (screenWidth >= 1280) return 6;
    if (screenWidth >= 1024) return 5;
    if (screenWidth >= 768) return 4;
    return 3;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (screenWidth < 768) {
      const cw = containerRef.current.offsetWidth;
      const count = Math.max(1, Math.floor(cw / 100));
      setCardWidth(Math.max(cw / count - 20, 60));
    } else {
      setCardWidth(160);
    }
  }, [screenWidth, movies]);

  useEffect(() => {
    if (!trackRef.current || movies.length === 0 || cardWidth <= 0) return;
    const c = setupCarousel({
      track: trackRef.current,
      cardCount: getCardCount(),
      cardWidth: cardWidth + 20,
      slideMilliSec: 3000,
    });
    if (c) setControls(c);
    return () => c?.cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies, screenWidth, cardWidth]);

  if (screenWidth <= 768) return null;

  return (
    <div className="w-full">
      <div className="my-1 md:my-6 mt-5 md:mt-12 mx-5 md:mx-16 lg:mx-20 xl:mx-24 text-3xl md:text-5xl font-bold text-color4 font-raleway">
        Now Playing.
      </div>
      <div
        className="mx-auto flex items-center rounded px-5 md:px-0"
        style={{
          width:
            screenWidth > 1280
              ? `${getCardCount() * (cardWidth + 20) + 100}px`
              : `${getCardCount() * (cardWidth + 20)}px`,
        }}
      >
        {screenWidth >= 1280 && (
          <button
            className="mr-7.5 hover:text-color4 text-color3"
            onClick={() => controls?.prevSlide()}
            aria-label="previous"
          >
            <FontAwesomeIcon size="2x" icon={faChevronLeft} />
          </button>
        )}
        <div ref={containerRef} className="my-7 rounded w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-nowrap will-change-transform"
          >
            {movies.map((movie) =>
              movie.poster_path ? (
                <Link
                  key={movie.id}
                  href={`/details/movie/${movie.id}`}
                  className="mx-2.5 shrink-0"
                  style={{ width: `${cardWidth}px` }}
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
            onClick={() => controls?.nextSlide()}
            aria-label="next"
          >
            <FontAwesomeIcon size="2x" icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
}
