"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { setupCarousel, type CarouselControls } from "@/lib/carousel";
import { ratingFormatter, dateFormatter } from "@/lib/utils";
import { TMDB_IMG } from "@/lib/tmdb";

type TrendingMovie = {
  id: number;
  title: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
};

type Props = {
  movies: TrendingMovie[];
  taglines: Record<number, string>;
};

export default function TrendingCarousel({ movies, taglines }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [controls, setControls] = useState<CarouselControls | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(1280);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cardWidth =
    screenWidth > 1280
      ? 1060
      : screenWidth > 768
        ? screenWidth - 150
        : screenWidth - 50;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || movies.length === 0) return;

    const c = setupCarousel({
      track,
      cardCount: 1,
      cardWidth,
      slideMilliSec: 10000,
    });
    if (c) setControls(c);
    return () => c?.cleanup();
  }, [movies, cardWidth]);

  return (
    <div
      className="mx-auto"
      style={{
        width: screenWidth > 1280 ? `${cardWidth + 120}px` : `${cardWidth}px`,
      }}
    >
      <div className="my-5 w-full">
        <div className="mx-auto flex items-center rounded w-full">
          {screenWidth > 1280 && (
            <button
              className="mr-10 text-color3 hover:text-color4"
              onClick={() => controls?.prevSlide()}
              aria-label="previous"
            >
              <FontAwesomeIcon size="2x" icon={faChevronLeft} />
            </button>
          )}

          <div className="relative my-8 rounded w-full overflow-hidden">
            <div ref={trackRef} className="flex">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="h-auto md:h-140 w-full shrink-0 relative"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-lg -z-10"
                    style={{
                      backgroundImage: `url(${TMDB_IMG}${movie.backdrop_path})`,
                      WebkitMaskImage:
                        "linear-gradient(to left, black 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 90%)",
                      maskImage:
                        "linear-gradient(to left, black 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 90%)",
                    }}
                  />

                  <div className="w-full h-full z-1 p-5 md:p-10 lg:p-20 text-color3 flex flex-col box-border">
                    <div className="w-full md:w-150 lg:w-187.5 tracking-wide text-3xl md:text-6xl font-bold mt-5 text-color4 font-raleway">
                      {movie.title}
                    </div>
                    <div className="mt-auto text-lg md:text-3xl font-bold text-color4 tracking-wide">
                      {taglines[movie.id]}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <div className="text-sm md:text-lg lg:text-xl font-bold tracking-wide text-color4">
                          {ratingFormatter(movie.vote_average)}
                        </div>
                        <div className="text-sm md:text-lg lg:text-xl font-bold mt-1 tracking-wide text-color4">
                          {`Release Date - ${dateFormatter(movie.release_date, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`}
                        </div>
                      </div>
                      <Link
                        href={`/details/movie/${movie.id}`}
                        className="p-3 rounded text-sm md:text-md lg:text-xl font-semibold bg-color5 text-color4 tracking-wide hover:bg-color3 hover:text-color1 hover:font-bold"
                      >
                        Details{" "}
                        <FontAwesomeIcon className="ml-1" icon={faCaretRight} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {screenWidth > 1280 && (
            <button
              className="ml-2 md:ml-10 text-color3 hover:text-color4"
              onClick={() => controls?.nextSlide()}
              aria-label="next"
            >
              <FontAwesomeIcon size="2x" icon={faChevronRight} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
