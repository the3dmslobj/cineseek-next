import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import { tmdb, TMDB_IMG, FALLBACK_POSTER, FALLBACK_PROFILE } from "@/lib/tmdb";
import { dateFormatter } from "@/lib/utils";

type Detail = {
  status?: string;
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
  last_air_date?: string;
  name?: string;
};

type Credits = {
  cast: { id: number; name: string; profile_path?: string }[];
  crew: { id: number; name: string; known_for_department: string; popularity: number }[];
};

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (type !== "movie" && type !== "tv") notFound();

  const [details, credits] = await Promise.all([
    tmdb<Detail>(`/${type}/${id}`),
    tmdb<Credits>(`/${type}/${id}/credits`),
  ]);

  const directors = credits.crew
    .filter((c) => c.known_for_department === "Directing")
    .sort((a, b) => b.popularity - a.popularity);

  const isTv = type === "tv";

  return (
    <>
      <Navbar />

      <div className="text-3xl md:text-4xl lg:text-5xl font-raleway font-bold mb-6 lg:mb-10 pl-10 md:pl-20 xl:pl-20 xl:ml-20 mt-10 xl:mt-0 h-fit min-h-12 text-color3 w-full xl:w-[1060px] pr-10 md:pr-24 xl:px-0">
        {details.title || details.name}
      </div>

      <div className="mx-auto flex lg:flex-row flex-col w-full xl:w-[1060px] flex-1 overflow-hidden lg:px-20 xl:px-0">
        <div className="lg:w-[230px] w-full flex flex-col">
          <img
            className="md:w-[230px] w-[200px] rounded mx-auto lg:mx-0"
            src={details.poster_path ? `${TMDB_IMG}${details.poster_path}` : FALLBACK_POSTER}
            alt=""
          />

          <div className="flex flex-col ml-10 my-5 lg:my-0 md:ml-20 lg:ml-0">
            <div className="flex w-full md:w-[230px] flex-wrap mt-2">
              <Tag>{details.status}</Tag>
              {isTv ? (
                <Tag>
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  {details.vote_average?.toFixed(1)}
                </Tag>
              ) : (
                <Tag>
                  {dateFormatter(details.release_date, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Tag>
              )}
            </div>
            <div className="flex w-full md:w-[230px] flex-wrap">
              {isTv ? (
                <>
                  <Tag>{details.number_of_seasons} Seasons</Tag>
                  <Tag>{details.number_of_episodes} Episodes</Tag>
                </>
              ) : (
                <>
                  <Tag>
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    {details.vote_average?.toFixed(1)}
                  </Tag>
                  <Tag>{details.runtime} mins</Tag>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden ml-10 md:ml-20 lg:ml-10 mr-12 md:mr-24 lg:mr-0">
          <SectionTitle>Overview.</SectionTitle>
          <SectionBody>{details.overview}</SectionBody>

          {details.genres && details.genres.length > 0 && (
            <>
              <SectionTitle>Genres.</SectionTitle>
              <SectionBody>
                {details.genres.map((g, i, arr) => (
                  <span key={g.id}>
                    {g.name}
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </SectionBody>
            </>
          )}

          {isTv && (
            <>
              <SectionTitle>Aired.</SectionTitle>
              <SectionBody>
                {`${dateFormatter(details.first_air_date, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} - ${
                  details.status === "Ended"
                    ? dateFormatter(details.last_air_date, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Ongoing"
                }`}
              </SectionBody>
            </>
          )}

          {directors.length > 0 && (
            <>
              <SectionTitle>Director.</SectionTitle>
              <SectionBody>
                <Link href={`/person/${directors[0].id}`} className="cursor-pointer">
                  {directors[0].name}
                </Link>
              </SectionBody>
            </>
          )}

          {credits.cast.length > 0 && (
            <>
              <SectionTitle>Casts.</SectionTitle>
              <div
                className="flex w-full overflow-x-auto mt-2 rounded scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {credits.cast.map((c) => (
                  <Link href={`/person/${c.id}`} key={c.id} className="m-2 w-[100px] flex-shrink-0 cursor-pointer">
                    <img
                      className="w-[100px] h-[100px] object-cover object-top rounded"
                      src={c.profile_path ? `${TMDB_IMG}${c.profile_path}` : FALLBACK_PROFILE}
                      alt=""
                    />
                    <div className="text-4 font-bold text-color2">{c.name}</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-8 w-fit flex items-center justify-center px-2 text-center bg-color1 text-md text-color4 rounded mr-2 font-bold mb-2 shrink-0 whitespace-nowrap">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-2xl md:text-3xl font-bold text-color3">{children}</div>;
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xl md:text-2xl font-medium text-color4 mt-2 mr-5 mb-5 md:mb-8 ml-5">
      {children}
    </div>
  );
}
