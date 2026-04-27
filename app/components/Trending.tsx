import { tmdb } from "@/lib/tmdb";
import TrendingHero, { type HeroItem } from "./TrendingHero";

type TrendingMovie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

type MovieDetail = {
  id: number;
  tagline?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
};

type Credits = {
  crew: {
    name: string;
    known_for_department: string;
    popularity: number;
  }[];
};

const HERO_COUNT = 4;

function fmtRuntime(minutes: number | undefined): string | undefined {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function Trending() {
  const list = await tmdb<{ results: TrendingMovie[] }>("/trending/movie/day");
  const movies = list.results.slice(0, 10);

  const heroMovies = movies.slice(0, HERO_COUNT);
  const [detailFetches, creditsFetches] = await Promise.all([
    Promise.all(
      heroMovies.map((m) =>
        tmdb<MovieDetail>(`/movie/${m.id}`).catch(
          () => ({ id: m.id }) as MovieDetail,
        ),
      ),
    ),
    Promise.all(
      heroMovies.map((m) =>
        tmdb<Credits>(`/movie/${m.id}/credits`).catch(
          () => ({ crew: [] }) as Credits,
        ),
      ),
    ),
  ]);

  const heroItems: HeroItem[] = heroMovies.map((m, i) => {
    const d = detailFetches[i];
    const c = creditsFetches[i];
    const director = c.crew
      .filter((p) => p.known_for_department === "Directing")
      .sort((a, b) => b.popularity - a.popularity)[0]?.name;
    return {
      id: m.id,
      title: m.title,
      overview: m.overview ?? "",
      poster_path: m.poster_path,
      year: (m.release_date ?? "").slice(0, 4) || "—",
      rating: m.vote_average ?? 0,
      tagline: d.tagline || undefined,
      runtime: fmtRuntime(d.runtime),
      genres: (d.genres ?? []).slice(0, 3).map((g) => g.name),
      director,
    };
  });

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "calc(100dvh - 3.5rem)" }}
    >
      <TrendingHero items={heroItems} />
      <section
        className="border-b py-3 overflow-hidden"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="marquee whitespace-nowrap">
          {[...movies, ...movies].map((m, i) => (
            <span
              key={i}
              className="cap inline-flex items-center gap-3"
              style={{ color: "var(--ink-2)" }}
            >
              <span className="text-accent">●</span>
              {m.title.toUpperCase()}{" "}
              <span style={{ color: "var(--ink-3)" }}>
                · {(m.release_date ?? "").slice(0, 4)} · ★{" "}
                {(m.vote_average ?? 0).toFixed(1)}
              </span>
              <span style={{ color: "var(--ink-3)" }} className="mx-3">
                /
              </span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
