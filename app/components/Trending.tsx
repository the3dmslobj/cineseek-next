import { tmdb } from "@/lib/tmdb";
import TrendingCarousel from "./TrendingCarousel";

type TrendingMovie = {
  id: number;
  title: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
};

type MovieDetail = { id: number; tagline?: string };

export default async function Trending() {
  const list = await tmdb<{ results: TrendingMovie[] }>("/trending/movie/day");
  const movies = list.results.slice(0, 10);

  const details = await Promise.all(
    movies.map((m) => tmdb<MovieDetail>(`/movie/${m.id}`).catch(() => ({ id: m.id })))
  );
  const taglines: Record<number, string> = {};
  details.forEach((d) => {
    if (d.tagline) taglines[d.id] = d.tagline;
  });

  return <TrendingCarousel movies={movies} taglines={taglines} />;
}
