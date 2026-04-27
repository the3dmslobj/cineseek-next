import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Avatar from "@/app/components/Avatar";
import HRow from "@/app/components/HRow";
import SectionLabel from "@/app/components/SectionLabel";
import { tmdb, TMDB_IMG } from "@/lib/tmdb";
import { dateFormatter } from "@/lib/utils";
import type { PosterItem } from "@/app/components/PosterCard";

type Person = {
  name?: string;
  known_for_department?: string;
  birthday?: string;
  biography?: string;
  place_of_birth?: string;
  profile_path?: string;
  deathday?: string;
};

type Credit = {
  job?: string;
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  vote_average?: number;
  poster_path?: string;
  credit_id: string;
  release_date?: string;
  first_air_date?: string;
};

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [person, combined] = await Promise.all([
    tmdb<Person>(`/person/${id}`),
    tmdb<{ cast: Credit[]; crew: Credit[] }>(`/person/${id}/combined_credits`),
  ]);

  const isDirector = person.known_for_department === "Directing";
  const rawCredits = isDirector
    ? combined.crew.filter((c) => c.job === "Director")
    : combined.cast;

  const credits: PosterItem[] = rawCredits.slice(0, 30).map((c) => ({
    id: c.id,
    title: c.title || c.name || "Untitled",
    poster_path: c.poster_path,
    year: (c.release_date || c.first_air_date || "").slice(0, 4) || undefined,
    rating: c.vote_average,
    type: c.media_type,
  }));

  const name = person.name ?? "Unknown";
  const role = person.known_for_department ?? "—";
  const born = person.birthday
    ? dateFormatter(person.birthday, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const birthplace = person.place_of_birth ?? "—";

  return (
    <>
      <Navbar />

      <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="frame p-3" style={{ background: "var(--panel)" }}>
              <div
                className="aspect-3/4 flex items-center justify-center frame overflow-hidden"
                style={{ background: "var(--bg)" }}
              >
                {person.profile_path ? (
                  <img
                    src={`${TMDB_IMG}${person.profile_path}`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar name={name} size={140} />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <div style={{ color: "var(--ink-3)" }}>BORN</div>
                  <div>{born}</div>
                </div>
                <div>
                  <div style={{ color: "var(--ink-3)" }}>FROM</div>
                  <div className="truncate">{birthplace}</div>
                </div>
                {person.deathday && (
                  <div>
                    <div style={{ color: "var(--ink-3)" }}>DIED</div>
                    <div>
                      {dateFormatter(person.deathday, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <div style={{ color: "var(--ink-3)" }}>CREDITS</div>
                  <div className="text-accent">{rawCredits.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="cap mb-3">// {role.toUpperCase()}</div>
            <h1 className="display text-[clamp(48px,8vw,128px)] mb-6">{name}</h1>
            {person.biography && (
              <p className="text-[15px] leading-relaxed max-w-2xl">
                {person.biography}
              </p>
            )}
          </div>
        </div>
      </section>

      {credits.length > 0 && (
        <section
          className="max-w-400 mx-auto px-5 md:px-8 py-16 border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <SectionLabel
            idx={1}
            label={isDirector ? "Directed" : "Filmography"}
            count={credits.length}
          />
          <HRow items={credits} />
        </section>
      )}

      <Footer />
    </>
  );
}
