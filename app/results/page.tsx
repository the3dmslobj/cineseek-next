import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faAnglesLeft,
  faAnglesRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { tmdb, TMDB_IMG, FALLBACK_POSTER } from "@/lib/tmdb";
import { dateFormatter, trimText } from "@/lib/utils";

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
  const type = sp.type === "tv" ? "tv" : "movie";
  const query = sp.query ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));

  let data: SearchResponse | null = null;
  if (query) {
    data = await tmdb<SearchResponse>(
      `/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
    );
  }

  const buildHref = (p: number) =>
    `/results?type=${type}&query=${encodeURIComponent(query)}&page=${p}`;

  return (
    <>
      <Navbar />

      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 md:mb-10 w-full xl:w-[1060px] text-color2 mx-auto mt-10 px-5 md:px-20 xl:px-5 tracking-wide">
        Results for &quot;{query}&quot;
      </div>

      <div className="w-full xl:w-[1060px] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mx-auto px-5 md:px-20 xl:px-5">
        {data?.results.map((r) => (
          <Link href={`/details/${type}/${r.id}`} key={r.id} className="relative cursor-pointer">
            <img
              src={r.poster_path ? `${TMDB_IMG}${r.poster_path}` : FALLBACK_POSTER}
              alt=""
              className="rounded-lg w-full h-full"
            />
            <div
              className="absolute bottom-2 left-2 flex w-[calc(100%-1rem)] justify-between px-3 py-1 rounded items-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            >
              <div className="flex-1 font-semibold text-color4">
                {trimText(r.title || r.name, 35)}
              </div>
            </div>
            <div
              className="absolute top-2 left-2 py-1 px-2 rounded font-semibold text-color4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            >
              <FontAwesomeIcon className="mr-1" icon={faStar} />
              {r.vote_average?.toFixed(1)}
            </div>
            {(r.release_date || r.first_air_date) && (
              <div
                className="absolute top-2 right-2 py-1 px-2 rounded font-semibold text-color4"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              >
                {dateFormatter(r.release_date || r.first_air_date, { year: "numeric" })}
              </div>
            )}
          </Link>
        ))}
      </div>

      {data && data.total_pages > 1 && (
        <div className="flex justify-center items-center pt-6 mt-6">
          {page > 1 && (
            <>
              <PageLink href={buildHref(1)} aria="first">
                <FontAwesomeIcon icon={faAnglesLeft} />
              </PageLink>
              <PageLink href={buildHref(page - 1)} aria="previous">
                <FontAwesomeIcon icon={faAngleLeft} />
              </PageLink>
            </>
          )}

          {Array.from({ length: 3 }, (_, i) => page + i)
            .filter((p) => p <= data!.total_pages)
            .map((p) => (
              <Link
                key={p}
                href={buildHref(p)}
                className={`w-10 h-10 mx-1 rounded flex items-center justify-center text-lg font-bold ${
                  p === page
                    ? "bg-color1 text-color4"
                    : "text-color2 hover:bg-color3 hover:text-color1"
                }`}
              >
                {p}
              </Link>
            ))}

          {page < data.total_pages && (
            <>
              <PageLink href={buildHref(page + 1)} aria="next">
                <FontAwesomeIcon icon={faAngleRight} />
              </PageLink>
              <PageLink href={buildHref(data.total_pages)} aria="last">
                <FontAwesomeIcon icon={faAnglesRight} />
              </PageLink>
            </>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

function PageLink({
  href,
  aria,
  children,
}: {
  href: string;
  aria: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={aria}
      className="w-10 h-10 mx-1 rounded flex items-center justify-center text-color2 hover:bg-color3 hover:text-color1"
    >
      {children}
    </Link>
  );
}
