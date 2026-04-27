import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { tmdb, TMDB_IMG } from "@/lib/tmdb";

type Item = {
  id: number;
  poster_path?: string;
  vote_average?: number;
};

export default async function TopRated() {
  const [moviesRes, seriesRes] = await Promise.all([
    tmdb<{ results: Item[] }>("/movie/top_rated?page=1"),
    tmdb<{ results: Item[] }>("/tv/top_rated?page=1"),
  ]);

  const movies = moviesRes.results.slice(0, 18);
  const series = seriesRes.results.slice(0, 18);

  return (
    <div className="w-full px-5 md:px-16 xl:px-10">
      <div className="text-2xl md:text-5xl font-bold text-color4 mt-0 md:mt-10 font-raleway xl:ml-16 ml-0">
        Don&apos;t Know What To Watch?
      </div>

      <div className="w-full flex flex-col">
        <Section title="Top-Rated Movies" type="movie" items={movies} />
        <Section title="Top-Rated Series" type="tv" items={series} />
      </div>
    </div>
  );
}

function Section({
  title,
  type,
  items,
}: {
  title: string;
  type: "movie" | "tv";
  items: Item[];
}) {
  return (
    <div className="my-0 mx-auto">
      <div className="flex items-center text-center mx-auto">
        <div className="my-2 mb-5 md:my-8 md:mb-6 text-xl md:text-3xl font-bold text-color2 items-center">
          {title}
        </div>
        <FontAwesomeIcon
          icon={faCaretRight}
          size="2x"
          className="ml-3 text-color2 pt-2 mb-5 md:mb-0"
        />
      </div>
      <div className="w-full xl:w-265 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {items.map((it) => (
          <Link
            href={`/details/${type}/${it.id}`}
            key={it.id}
            className="relative cursor-pointer"
          >
            <img
              src={`${TMDB_IMG}${it.poster_path}`}
              alt=""
              className="w-full shrink-0 rounded block h-auto"
            />
            <div
              className="absolute bottom-2 right-2 text-xs md:text-sm font-bold p-1 text-color4 rounded"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.497)" }}
            >
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              {it.vote_average ? Number(it.vote_average.toFixed(1)) : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
