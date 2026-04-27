import { tmdb } from "@/lib/tmdb";
import PosterCard, { type PosterItem } from "./PosterCard";
import SectionLabel from "./SectionLabel";

type Item = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

function toPoster(it: Item, type: "movie" | "tv"): PosterItem {
  return {
    id: it.id,
    title: it.title || it.name || "Untitled",
    poster_path: it.poster_path,
    year: (it.release_date || it.first_air_date || "").slice(0, 4) || undefined,
    rating: it.vote_average,
    type,
  };
}

export default async function TopRated() {
  const [moviesRes, seriesRes] = await Promise.all([
    tmdb<{ results: Item[] }>("/movie/top_rated?page=1"),
    tmdb<{ results: Item[] }>("/tv/top_rated?page=1"),
  ]);

  const movies = moviesRes.results.slice(0, 12).map((m) => toPoster(m, "movie"));
  const series = seriesRes.results.slice(0, 12).map((s) => toPoster(s, "tv"));

  return (
    <>
      <section
        className="max-w-400 mx-auto px-5 md:px-8 py-16 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        <SectionLabel idx={2} label="Top rated · films" count={movies.length} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((m) => (
            <PosterCard key={m.id} item={m} />
          ))}
        </div>
      </section>
      <section
        className="max-w-400 mx-auto px-5 md:px-8 py-16 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        <SectionLabel idx={3} label="Top rated · series" count={series.length} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {series.map((s) => (
            <PosterCard key={s.id} item={s} />
          ))}
        </div>
      </section>
    </>
  );
}
