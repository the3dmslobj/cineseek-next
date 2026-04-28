"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFaceMehBlank,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { dateFormatter } from "@/lib/utils";
import { TMDB_IMG } from "@/lib/tmdb";
import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import Avatar from "./Avatar";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
};

function emailToName(email: string | undefined) {
  if (!email) return "user";
  return email.split("@")[0];
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
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
        query,
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      },
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

  const username = emailToName(user?.email);

  return (
    <header
      className="border-b sticky top-0 z-40"
      style={{ borderColor: "var(--line)", background: "var(--bg)" }}
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-14 flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center justify-center w-7 h-7 font-bold text-[13px]"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              border: "1px solid var(--ink)",
            }}
          >
            M
          </span>
          <span className="font-grotesk font-bold tracking-tight text-lg">
            movimemo
          </span>
        </Link>

        <Link
          href="/watch-next"
          className="cap ulink hidden md:inline-block"
          style={{
            color: pathname.startsWith("/watch-next")
              ? "var(--accent)"
              : "var(--ink)",
          }}
        >
          WATCH NEXT
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToResults();
          }}
          className="hidden md:flex items-center ml-auto flex-1 max-w-md border relative"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="px-3 cap">&gt;</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (blurTimeout.current) clearTimeout(blurTimeout.current);
              setIsDropdownVisible(true);
            }}
            onBlur={() => {
              blurTimeout.current = setTimeout(
                () => setIsDropdownVisible(false),
                150,
              );
            }}
            placeholder="search films and series…"
            className="bg-transparent outline-none flex-1 text-[12px] py-2 font-mono placeholder:text-ink-3"
            style={{ color: "var(--ink)" }}
          />
          <div className="flex border-l" style={{ borderColor: "var(--line)" }}>
            <button
              type="button"
              onClick={() => setMovieOrTv("movie")}
              className="w-8 h-9 text-[10px] font-mono"
              style={{
                background:
                  movieOrTv === "movie" ? "var(--ink)" : "transparent",
                color: movieOrTv === "movie" ? "var(--bg)" : "var(--ink-2)",
              }}
            >
              M
            </button>
            <button
              type="button"
              onClick={() => setMovieOrTv("tv")}
              className="w-8 h-9 text-[10px] font-mono"
              style={{
                background: movieOrTv === "tv" ? "var(--ink)" : "transparent",
                color: movieOrTv === "tv" ? "var(--bg)" : "var(--ink-2)",
              }}
            >
              S
            </button>
          </div>
          <button
            className="px-3 h-9 cap border-l"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            aria-label="search"
          >
            ↵
          </button>

          {isDropdownVisible && query !== "" && (
            <div
              className="absolute top-12 left-0 right-0 z-10"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
              }}
              onMouseDown={() => {
                if (blurTimeout.current) clearTimeout(blurTimeout.current);
              }}
            >
              {resultArray.length > 0 ? (
                resultArray.map((r) => (
                  <Link
                    key={r.id}
                    href={`/details/${movieOrTv}/${r.id}`}
                    className="flex items-center gap-3 p-2 transition"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <img
                      className="w-10 frame"
                      src={
                        r.poster_path
                          ? `${TMDB_IMG}${r.poster_path}`
                          : "https://dummyimage.com/100x140/111/111.png"
                      }
                      alt=""
                    />
                    <div
                      className="flex-1 text-[12px] truncate"
                      style={{ color: "var(--ink)" }}
                    >
                      {r.title || r.name}
                    </div>
                    <div className="cap shrink-0">
                      {dateFormatter(r.release_date || r.first_air_date, {
                        year: "numeric",
                      })}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center p-4">
                  <FontAwesomeIcon
                    className="text-color2 mb-2"
                    icon={faFaceMehBlank}
                  />
                  <div className="cap">// no matches</div>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <div className="md:hidden">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="btn-icon"
              aria-label="search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-icon"
            aria-label="toggle theme"
          >
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
          </button>

          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-2 h-10 frame"
            >
              <Avatar name={username} size={20} />
              <span
                className="hidden sm:inline cap"
                style={{ color: "var(--ink)" }}
              >
                {username}
              </span>
            </Link>
          ) : (
            <>
              <div className="hidden md:contents">
                <button onClick={() => setAuthOpen(true)} className="btn">
                  Sign in
                </button>
              </div>
              <button
                onClick={() => setAuthOpen(true)}
                className="btn btn-primary"
              >
                Join →
              </button>
            </>
          )}
        </div>
      </div>

      {searchModalOpen && (
        <>
          <div className="modal-bg" onClick={() => setSearchModalOpen(false)} />
          <div className="modal" role="dialog">
            <div className="modal-hd">
              <span>SEARCH.MOD</span>
              <button
                onClick={() => setSearchModalOpen(false)}
                aria-label="close"
                className="hover:text-accent"
                style={{ color: "var(--ink-3)" }}
              >
                [X]
              </button>
            </div>
            <div className="modal-bd">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query) return;
                  setSearchModalOpen(false);
                  goToResults();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="cap block mb-2">Query</label>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="title, name…"
                    className="field"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="cap mr-2">Type</span>
                  <button
                    type="button"
                    onClick={() => setMovieOrTv("movie")}
                    className={`tag ${movieOrTv === "movie" ? "solid" : ""}`}
                  >
                    FILMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovieOrTv("tv")}
                    className={`tag ${movieOrTv === "tv" ? "solid" : ""}`}
                  >
                    SERIES
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!query}
                  className="btn btn-primary w-full justify-center disabled:opacity-50"
                >
                  Search →
                </button>
              </form>

              {query && resultArray.length > 0 && (
                <div
                  className="mt-6 border-t pt-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="cap mb-3">// suggestions</div>
                  <div className="space-y-2">
                    {resultArray.map((r) => (
                      <Link
                        key={r.id}
                        href={`/details/${movieOrTv}/${r.id}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center gap-3 p-2 frame"
                      >
                        <img
                          className="w-10"
                          src={
                            r.poster_path
                              ? `${TMDB_IMG}${r.poster_path}`
                              : "https://dummyimage.com/100x140/111/111.png"
                          }
                          alt=""
                        />
                        <div
                          className="flex-1 text-[12px] truncate"
                          style={{ color: "var(--ink)" }}
                        >
                          {r.title || r.name}
                        </div>
                        <div className="cap shrink-0">
                          {dateFormatter(r.release_date || r.first_air_date, {
                            year: "numeric",
                          })}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
