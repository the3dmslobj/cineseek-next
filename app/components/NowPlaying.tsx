import { tmdb } from "@/lib/tmdb";
import NowPlayingCarousel from "./NowPlayingCarousel";

type Movie = { id: number; poster_path?: string };

export default async function NowPlaying() {
  const data = await tmdb<{ results: Movie[] }>("/movie/now_playing?page=1");
  const movies = (data.results ?? []).filter((m) => m.poster_path && m.id);
  return <NowPlayingCarousel movies={movies} />;
}
