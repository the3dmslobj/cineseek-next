import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PosterCard, { type PosterItem } from "@/app/components/PosterCard";
import { tmdb } from "@/lib/tmdb";

type Result = {
  id: number;
  vote_average?: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
};

type SearchResponse = {
  page: number;
  results: Result[];
  total_pages: number;
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; query?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const type: "movie" | "tv" = sp.type === "tv" ? "tv" : "movie";
  const query = sp.query ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));

  let data: SearchResponse | null = null;
  if (query) {
    data = await tmdb<SearchResponse>(
      `/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`,
    );
  }

  const items: PosterItem[] = (data?.results ?? []).map((r) => ({
    id: r.id,
    title: r.title || r.name || "Untitled",
    poster_path: r.poster_path,
    year: (r.release_date || r.first_air_date || "").slice(0, 4) || undefined,
    rating: r.vote_average,
    type,
  }));

  const totalPages = data?.total_pages ?? 0;
  const buildHref = (p: number) =>
    `/results?type=${type}&query=${encodeURIComponent(query)}&page=${p}`;

  return (
    <>
      <Navbar />

      <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16">
        <div
          className="border-b pb-6 mb-8"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="cap mb-3">// QUERY</div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="display text-[clamp(40px,6vw,84px)]">
              {query
                ? `"${query}"`
                : type === "tv"
                  ? "All series."
                  : "All films."}
            </h1>
            <span className="cap">
              [{String(items.length).padStart(3, "0")} RESULTS]
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <Link
            href={`/results?type=movie&query=${encodeURIComponent(query)}`}
            className={`tag ${type === "movie" ? "solid" : ""}`}
          >
            FILMS
          </Link>
          <Link
            href={`/results?type=tv&query=${encodeURIComponent(query)}`}
            className={`tag ${type === "tv" ? "solid" : ""}`}
          >
            SERIES
          </Link>
        </div>

        {items.length === 0 ? (
          <div
            className="frame p-16 text-center"
            style={{ background: "var(--panel)" }}
          >
            <div className="cap mb-3">
              {query ? "// 0 RESULTS" : "// EMPTY_QUERY"}
            </div>
            <h3 className="display text-3xl mb-2">
              {query ? "No matches." : "Type something to search."}
            </h3>
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              {query
                ? "Try different terms."
                : "Use the search bar above."}
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
            {page > 1 ? (
              <Link href={buildHref(page - 1)} className="btn">
                ← Prev
              </Link>
            ) : (
              <span />
            )}
            <span className="cap">
              PAGE {String(page).padStart(3, "0")} /{" "}
              {String(totalPages).padStart(3, "0")}
            </span>
            {page < totalPages ? (
              <Link href={buildHref(page + 1)} className="btn">
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
