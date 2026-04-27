"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFaceMehBlank } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter } from "@/lib/utils";
import { TMDB_IMG } from "@/lib/tmdb";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [movieOrTv, setMovieOrTv] = useState<"movie" | "tv">("movie");
  const [query, setQuery] = useState("");
  const [resultArray, setResultArray] = useState<SearchResult[]>([]);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query) return;
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const controller = new AbortController();
    fetch(
      `https://api.themoviedb.org/3/search/${movieOrTv}?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: { accept: "application/json", Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }
    )
      .then((r) => r.json())
      .then((data) => setResultArray(data.results?.slice(0, 4) ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, [query, movieOrTv]);

  const goToResults = () => {
    if (!query) return;
    const url = `/results?type=${movieOrTv}&query=${encodeURIComponent(query)}`;
    if (pathname.startsWith("/results")) {
      router.replace(url);
      setQuery("");
    } else {
      router.push(url);
    }
  };

  return (
    <>
      <Link href="/" className="ml-5 text-3xl font-bold my-5 font-raleway text-color2 md:hidden block">
        Cineseek
      </Link>
      <div className="flex justify-between md:my-8 md:mx-20 mx-5">
        <Link href="/" className="hidden xl:block">
          <img className="h-12 cursor-pointer" src="/cineseek-logo-black.svg" alt="main-logo" />
        </Link>

        <div className="w-full lg:w-full xl:w-[680px] h-12 flex items-center relative justify-between">
          <Link
            href="/"
            className="text-4xl font-bold text-color1 cursor-pointer font-dmSans hidden md:block xl:mr-auto"
          >
            CineSeek
          </Link>

          <div className="flex ml-0 items-center h-12 relative w-full justify-end">
            <input
              className="w-full md:w-[270px] h-12 px-3 rounded-xl text-[18px] text-color4 border-2 border-color1 bg-color1 placeholder-color4 focus:outline-none focus:border-[3px] focus:border-color2"
              type="text"
              placeholder="Search with name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (blurTimeout.current) clearTimeout(blurTimeout.current);
                setIsDropdownVisible(true);
              }}
              onBlur={() => {
                blurTimeout.current = setTimeout(() => setIsDropdownVisible(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToResults();
              }}
            />

            <div
              className="flex h-12 bg-color3 rounded-xl relative ml-3 md:mx-2 cursor-pointer"
              onClick={() => setMovieOrTv(movieOrTv === "movie" ? "tv" : "movie")}
            >
              <div
                className={
                  movieOrTv === "movie"
                    ? "h-10 w-10 absolute top-1 right-1 bg-color1 rounded-lg"
                    : "h-10 w-10 absolute top-1 left-1 bg-color1 rounded-lg"
                }
              />
              <div className="h-12 w-12 flex items-center justify-center rounded-[10px] font-bold text-color1">M</div>
              <div className="h-12 w-12 flex items-center justify-center rounded-[10px] font-bold text-color1">S</div>
            </div>

            <button
              className="h-12 w-12 rounded-xl text-center text-color4 border-3 border-color2 cursor-pointer bg-color1 hover:border-color2 hover:text-color1 hover:bg-color3 transition duration-500 hidden md:block"
              onClick={goToResults}
              aria-label="search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            {isDropdownVisible && query !== "" && (
              <div
                className="absolute top-14 md:right-14 w-full md:w-[375px] bg-color1 z-10 rounded-lg"
                onMouseDown={() => {
                  if (blurTimeout.current) clearTimeout(blurTimeout.current);
                }}
              >
                {resultArray.length > 0 ? (
                  resultArray.map((result) => (
                    <Link
                      key={result.id}
                      href={`/details/${movieOrTv}/${result.id}`}
                      className="flex items-center w-full gap-5 p-2 cursor-pointer rounded hover:bg-color5 transition"
                    >
                      <img
                        className="max-w-16 rounded"
                        src={
                          result.poster_path
                            ? `${TMDB_IMG}${result.poster_path}`
                            : "https://dummyimage.com/100x140/ffffff/ffffff.png"
                        }
                        alt=""
                      />
                      <div className="text-4 font-bold text-color4">{result.title || result.name}</div>
                      <div className="ml-auto flex-column items-center justify-center shrink-0 font-bold text-color4">
                        {dateFormatter(result.release_date || result.first_air_date, { year: "numeric" })}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col w-full items-center p-3">
                    <FontAwesomeIcon className="h-8 mb-3 text-color2" icon={faFaceMehBlank} />
                    <div className="font-bold text-lg text-color2">Sorry, we can&apos;t find it.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
