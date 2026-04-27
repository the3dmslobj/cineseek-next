import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import { tmdb, TMDB_IMG, FALLBACK_PROFILE } from "@/lib/tmdb";
import { dateFormatter, trimText } from "@/lib/utils";

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
  character?: string;
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
  const credits = isDirector
    ? combined.crew.filter((c) => c.job === "Director")
    : combined.cast;

  return (
    <>
      <Navbar />

      <div className="text-3xl md:text-4xl lg:text-5xl font-raleway font-bold mb-5 lg:mb-10 ml-10 md:ml-20 mt-10 xl:mt-0 h-fit min-h-12 text-color3">
        {person.name}
      </div>

      <div className="mx-auto flex lg:flex-row flex-col w-full xl:w-265 flex-1 overflow-hidden lg:px-20 xl:px-0">
        <div className="lg:w-57.5 w-full flex flex-col">
          <img
            className="md:w-57.5 w-50 rounded mx-auto lg:mx-0"
            src={person.profile_path ? `${TMDB_IMG}${person.profile_path}` : FALLBACK_PROFILE}
            alt=""
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden ml-10 md:ml-20 lg:ml-10 mr-12 md:mr-24 lg:mr-0 mt-10 lg:mt-0">
          {person.biography && (
            <>
              <SectionTitle>Biography.</SectionTitle>
              <SectionBody>{person.biography}</SectionBody>
            </>
          )}
          {person.birthday && (
            <>
              <SectionTitle>Born on.</SectionTitle>
              <SectionBody>
                {dateFormatter(person.birthday, { day: "numeric", month: "short", year: "numeric" })}
              </SectionBody>
            </>
          )}
          {person.deathday && (
            <>
              <SectionTitle>Died on.</SectionTitle>
              <SectionBody>
                {dateFormatter(person.deathday, { day: "numeric", month: "short", year: "numeric" })}
              </SectionBody>
            </>
          )}
          {person.place_of_birth && (
            <>
              <SectionTitle>Birthplace.</SectionTitle>
              <SectionBody>{person.place_of_birth}</SectionBody>
            </>
          )}
          <SectionTitle>Occupation.</SectionTitle>
          <SectionBody>{person.known_for_department}</SectionBody>

          <SectionTitle>{isDirector ? "Directed." : "Appeared in as."}</SectionTitle>
          <div
            className="flex w-full overflow-x-auto mt-2 mb-5 rounded scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {credits.map((c) => (
              <Link
                href={`/details/${c.media_type}/${c.id}`}
                key={c.credit_id}
                className="max-w-40 w-40 m-2 cursor-pointer"
              >
                <div className="w-full shrink-0 relative overflow-hidden">
                  <img
                    className="max-w-40 w-40 h-60 object-cover object-top rounded"
                    src={c.poster_path ? `${TMDB_IMG}${c.poster_path}` : FALLBACK_PROFILE}
                    alt=""
                  />
                  <div
                    className="w-38 font-bold text-color4 absolute bottom-1 right-1 p-1 rounded"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                  >
                    {trimText(c.title || c.name, 33)}
                  </div>
                  <div
                    className="absolute top-1 left-1 py-1 px-2 rounded font-semibold text-color4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                  >
                    <FontAwesomeIcon className="mr-1" icon={faStar} />
                    {c.vote_average?.toFixed(1)}
                  </div>
                  {(c.release_date || c.first_air_date) && (
                    <div
                      className="absolute top-1 right-1 py-1 px-2 rounded font-semibold text-color4"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                    >
                      {dateFormatter(c.release_date || c.first_air_date, { year: "numeric" })}
                    </div>
                  )}
                </div>
                {!isDirector && c.character && (
                  <div className="text-color2 text-lg mt-2 font-bold w-full">{c.character}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-2xl md:text-3xl font-bold text-color3">{children}</div>;
}
function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xl md:text-2xl font-medium text-color4 mt-2 mr-5 mb-5 md:mb-8 ml-5 tracking-wide">
      {children}
    </div>
  );
}
