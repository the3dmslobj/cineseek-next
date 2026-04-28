import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PosterCard, { type PosterItem } from "@/app/components/PosterCard";
import { tmdb } from "@/lib/tmdb";
import {
  MOODS,
  MOVIE_GENRES,
  TV_GENRES,
  RUNTIME_PRESETS,
  SORT_OPTIONS,
  parseFilters,
  buildDiscoverPath,
  buildHref,
} from "@/lib/moods";

type DiscoverResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

type DiscoverResponse = {
  page: number;
  results: DiscoverResult[];
  total_pages: number;
};

const YEARS: number[] = (() => {
  const arr: number[] = [];
  for (let y = 2026; y >= 1950; y--) arr.push(y);
  return arr;
})();

const RATING_OPTIONS = [9, 8, 7, 6, 5];

export const dynamic = "force-dynamic";

export default async function WatchNextPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const f = parseFilters(sp);

  const data = await tmdb<DiscoverResponse>(buildDiscoverPath(f));
  const items: PosterItem[] = (data.results ?? []).map((r) => ({
    id: r.id,
    title: r.title || r.name || "Untitled",
    poster_path: r.poster_path,
    year: (r.release_date || r.first_air_date || "").slice(0, 4) || undefined,
    rating: r.vote_average,
    type: f.type,
  }));

  const totalPages = Math.min(data.total_pages ?? 0, 500);
  const genres = f.type === "tv" ? TV_GENRES : MOVIE_GENRES;

  return (
    <>
      <Navbar />

      <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16">
        <div
          className="border-b pb-6 mb-8"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="cap mb-3">// watch next</div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="display text-[clamp(40px,6vw,84px)]">
              Pick a mood.
            </h1>
            <span className="cap">
              [{String(items.length).padStart(3, "0")} RESULTS]
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Link
            href={buildHref("/watch-next", { ...f, type: "movie", page: 1 })}
            className={`tag ${f.type === "movie" ? "solid" : ""}`}
          >
            FILMS
          </Link>
          <Link
            href={buildHref("/watch-next", { ...f, type: "tv", page: 1 })}
            className={`tag ${f.type === "tv" ? "solid" : ""}`}
          >
            SERIES
          </Link>
        </div>

        <form
          method="get"
          action="/watch-next"
          className="frame p-4 md:p-5 mb-8"
          style={{ background: "var(--panel)" }}
        >
          <input type="hidden" name="type" value={f.type} />

          <div className="mb-5">
            <div className="cap mb-2">// mood</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                name="mood"
                value=""
                className={`tag ${!f.mood ? "solid" : ""}`}
              >
                ANY
              </button>
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="submit"
                  name="mood"
                  value={m.key}
                  title={m.hint}
                  className={`tag ${f.mood === m.key ? "solid" : ""}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <FilterSelect
              label="Genre"
              name="genre"
              defaultValue={f.genre ? String(f.genre) : ""}
              options={[
                { value: "", label: "Any" },
                ...genres.map((g) => ({ value: String(g.id), label: g.name })),
              ]}
            />
            <FilterSelect
              label="Year"
              name="year"
              defaultValue={f.year ? String(f.year) : ""}
              options={[
                { value: "", label: "Any" },
                ...YEARS.map((y) => ({ value: String(y), label: String(y) })),
              ]}
            />
            <FilterSelect
              label="Rating ≥"
              name="ratingMin"
              defaultValue={f.ratingMin ? String(f.ratingMin) : ""}
              options={[
                { value: "", label: "Any" },
                ...RATING_OPTIONS.map((r) => ({
                  value: String(r),
                  label: `${r}.0+`,
                })),
              ]}
            />
            <FilterSelect
              label="Runtime"
              name="runtime"
              defaultValue={f.runtime ?? ""}
              options={[
                { value: "", label: "Any" },
                ...Object.entries(RUNTIME_PRESETS).map(([k, v]) => ({
                  value: k,
                  label: v.label,
                })),
              ]}
            />
            <FilterSelect
              label="Sort"
              name="sort"
              defaultValue={f.sort}
              options={SORT_OPTIONS.map((o) => ({
                value: o.key,
                label: o.label,
              }))}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-5">
            <Link href={`/watch-next?type=${f.type}`} className="cap ulink">
              RESET
            </Link>
            <button type="submit" className="btn btn-primary">
              Apply →
            </button>
          </div>
        </form>

        {items.length === 0 ? (
          <div
            className="frame p-16 text-center"
            style={{ background: "var(--panel)" }}
          >
            <div className="cap mb-3">// 0 results</div>
            <h3 className="display text-3xl mb-2">Nothing matches.</h3>
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              Loosen a filter and try again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div
            className="flex items-center justify-between mt-12 pt-6 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            {f.page > 1 ? (
              <Link
                href={buildHref("/watch-next", { ...f, page: f.page - 1 })}
                className="btn"
              >
                ← Prev
              </Link>
            ) : (
              <span />
            )}
            <span className="cap">
              PAGE {String(f.page).padStart(3, "0")} /{" "}
              {String(totalPages).padStart(3, "0")}
            </span>
            {f.page < totalPages ? (
              <Link
                href={buildHref("/watch-next", { ...f, page: f.page + 1 })}
                className="btn"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

function FilterSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="cap block mb-1">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="field"
        style={{ height: 40, padding: "0 10px" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
