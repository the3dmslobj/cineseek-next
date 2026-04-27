import { tmdb } from "@/lib/tmdb";
import HRow from "./HRow";
import SectionLabel from "./SectionLabel";
import type { PosterItem } from "./PosterCard";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

export default async function NowPlaying() {
  const data = await tmdb<{ results: Movie[] }>("/movie/now_playing?page=1");
  const items: PosterItem[] = (data.results ?? [])
    .filter((m) => m.poster_path && m.id)
    .slice(0, 12)
    .map((m) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      year: m.release_date ? m.release_date.slice(0, 4) : undefined,
      rating: m.vote_average,
      type: "movie",
    }));

  return (
    <section className="max-w-400 mx-auto px-5 md:px-8 py-16">
      <SectionLabel idx={1} label="Now playing" count={items.length} />
      <HRow items={items} />
    </section>
  );
}
