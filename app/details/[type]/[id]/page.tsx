import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LibraryButtons from "@/app/components/LibraryButtons";
import SectionLabel from "@/app/components/SectionLabel";
import HRow from "@/app/components/HRow";
import Avatar from "@/app/components/Avatar";
import { tmdb, TMDB_IMG, FALLBACK_POSTER } from "@/lib/tmdb";
import type { PosterItem } from "@/app/components/PosterCard";

type Detail = {
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  overview?: string;
  runtime?: number;
  poster_path?: string;
  title?: string;
  release_date?: string;
  genres?: { id: number; name: string }[];
  first_air_date?: string;
  name?: string;
  tagline?: string;
};

type Credits = {
  cast: { id: number; name: string; character?: string; profile_path?: string }[];
  crew: {
    id: number;
    name: string;
    known_for_department: string;
    popularity: number;
  }[];
};

type Recommendations = {
  results: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
  }[];
};

function fmtRuntime(minutes: number | undefined): string | undefined {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (type !== "movie" && type !== "tv") notFound();

  const [details, credits, recs] = await Promise.all([
    tmdb<Detail>(`/${type}/${id}`),
    tmdb<Credits>(`/${type}/${id}/credits`),
    tmdb<Recommendations>(`/${type}/${id}/recommendations`).catch(
      () => ({ results: [] }) as Recommendations,
    ),
  ]);

  const director = credits.crew
    .filter((c) => c.known_for_department === "Directing")
    .sort((a, b) => b.popularity - a.popularity)[0];

  const isTv = type === "tv";
  const title = details.title || details.name || "Untitled";
  const year = (details.release_date || details.first_air_date || "").slice(0, 4) || "—";
  const code = String(Number(id)).padStart(4, "0");
  const runtime = isTv
    ? `${details.number_of_seasons ?? 0}S / ${details.number_of_episodes ?? 0}EP`
    : (fmtRuntime(details.runtime) ?? "—");
  const genres = details.genres ?? [];

  const related: PosterItem[] = recs.results.slice(0, 12).map((r) => ({
    id: r.id,
    title: r.title || r.name || "Untitled",
    poster_path: r.poster_path,
    year: (r.release_date || r.first_air_date || "").slice(0, 4) || undefined,
    rating: r.vote_average,
    type,
  }));

  return (
    <>
      <Navbar />

      <section className="noise border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-400 mx-auto px-5 md:px-8 py-10 md:py-14 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="frame p-3" style={{ background: "var(--panel)" }}>
              <div className="poster">
                <img
                  src={
                    details.poster_path
                      ? `${TMDB_IMG}${details.poster_path}`
                      : FALLBACK_POSTER
                  }
                  alt={title}
                />
                <span className="corner c-tl">{code}</span>
                <span className="corner c-tr">{year}</span>
                <span className="corner c-bl">{isTv ? "SER" : "FLM"}</span>
                {details.vote_average != null && (
                  <span className="corner c-br">★ {details.vote_average.toFixed(1)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="tag solid">{isTv ? "SERIES" : "FILM"}</span>
              <span className="cap">/ ID {code} / {year}</span>
            </div>
            <h1 className="display text-[clamp(40px,7vw,108px)] mb-4">{title}</h1>
            {details.tagline && (
              <p
                className="font-grotesk italic text-xl md:text-2xl mb-6"
                style={{ color: "var(--ink-2)" }}
              >
                &ldquo;{details.tagline}&rdquo;
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {details.vote_average != null && (
                <span className="tag accent">★ {details.vote_average.toFixed(1)}</span>
              )}
              <span className="tag">{year}</span>
              <span className="tag">{runtime}</span>
              {genres.map((g) => (
                <span key={g.id} className="tag">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed max-w-2xl mb-8">
              {details.overview}
            </p>

            <LibraryButtons
              movieId={Number(id)}
              mediaType={type as "movie" | "tv"}
            />

            <div
              className="grid grid-cols-2 md:grid-cols-4 border"
              style={{ borderColor: "var(--line)" }}
            >
              {[
                {
                  label: "Director",
                  value: director?.name ?? "—",
                  href: director ? `/person/${director.id}` : undefined,
                },
                {
                  label: "Genre",
                  value: genres.map((g) => g.name).join(" / ") || "—",
                },
                { label: "Runtime", value: runtime },
                { label: "Year", value: year },
              ].map((cell, i) => (
                <div
                  key={cell.label}
                  className={`p-4 ${i > 0 ? "border-l" : ""}`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="cap mb-1">{cell.label}</div>
                  <div className="text-sm">
                    {cell.href ? (
                      <Link href={cell.href} className="ulink">
                        {cell.value}
                      </Link>
                    ) : (
                      cell.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {credits.cast.length > 0 && (
        <section className="max-w-400 mx-auto px-5 md:px-8 py-16">
          <SectionLabel idx={1} label="Cast" count={credits.cast.length} />
          <div className="h-scroll flex gap-4 overflow-x-auto pb-2">
            {credits.cast.slice(0, 20).map((c) => (
              <Link
                key={c.id}
                href={`/person/${c.id}`}
                className="frame p-3 shrink-0"
                style={{ width: 160, background: "var(--panel)" }}
              >
                <div
                  className="aspect-[3/4] flex items-center justify-center mb-3 overflow-hidden frame"
                  style={{ background: "var(--bg)" }}
                >
                  {c.profile_path ? (
                    <img
                      src={`${TMDB_IMG}${c.profile_path}`}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar name={c.name} size={56} />
                  )}
                </div>
                <div className="text-[12px] font-grotesk font-semibold leading-tight">
                  {c.name}
                </div>
                {c.character && <div className="cap mt-1">{c.character}</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section
          className="max-w-400 mx-auto px-5 md:px-8 py-16 border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <SectionLabel idx={2} label="Related" count={related.length} />
          <HRow items={related} />
        </section>
      )}

      <Footer />
    </>
  );
}
