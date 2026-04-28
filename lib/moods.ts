export type MediaType = "movie" | "tv";

export type MoodKey =
  | "cozy"
  | "tense"
  | "uplifting"
  | "mind-bending"
  | "melancholy"
  | "adventurous"
  | "dark";

export type Mood = {
  key: MoodKey;
  label: string;
  hint: string;
  movieGenres: number[];
  tvGenres: number[];
};

export const MOODS: Mood[] = [
  {
    key: "cozy",
    label: "Cozy",
    hint: "warm, easy, familiar",
    movieGenres: [10751, 35, 16],
    tvGenres: [10751, 35, 16],
  },
  {
    key: "tense",
    label: "Tense",
    hint: "edge of seat",
    movieGenres: [53, 27, 9648],
    tvGenres: [80, 9648],
  },
  {
    key: "uplifting",
    label: "Uplifting",
    hint: "feel-good",
    movieGenres: [35, 10402, 10749],
    tvGenres: [35, 10751],
  },
  {
    key: "mind-bending",
    label: "Mind-bending",
    hint: "puzzles, twists",
    movieGenres: [878, 9648, 53],
    tvGenres: [10765, 9648],
  },
  {
    key: "melancholy",
    label: "Melancholy",
    hint: "slow, heavy, beautiful",
    movieGenres: [18, 10749],
    tvGenres: [18],
  },
  {
    key: "adventurous",
    label: "Adventurous",
    hint: "wide screens, motion",
    movieGenres: [12, 28, 14],
    tvGenres: [10759, 10765],
  },
  {
    key: "dark",
    label: "Dark",
    hint: "crime, dread, noir",
    movieGenres: [80, 53, 18],
    tvGenres: [80, 18, 10768],
  },
];

export const MOVIE_GENRES: { id: number; name: string }[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const TV_GENRES: { id: number; name: string }[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

export type RuntimePreset = "short" | "standard" | "long";

export const RUNTIME_PRESETS: Record<
  RuntimePreset,
  { label: string; gte?: number; lte?: number }
> = {
  short: { label: "< 90m", lte: 89 },
  standard: { label: "90–120m", gte: 90, lte: 120 },
  long: { label: "> 120m", gte: 121 },
};

export type SortKey = "popular" | "top" | "new";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "top", label: "Top rated" },
  { key: "new", label: "Newest" },
];

export function sortByFor(type: MediaType, key: SortKey): string {
  if (key === "top") return "vote_average.desc";
  if (key === "new")
    return type === "tv" ? "first_air_date.desc" : "primary_release_date.desc";
  return "popularity.desc";
}

export type WatchNextFilters = {
  type: MediaType;
  mood?: MoodKey;
  genre?: number;
  year?: number;
  ratingMin?: number;
  runtime?: RuntimePreset;
  sort: SortKey;
  page: number;
};

export function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): WatchNextFilters {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const type: MediaType = get("type") === "tv" ? "tv" : "movie";
  const moodRaw = get("mood");
  const mood = MOODS.find((m) => m.key === moodRaw)?.key;
  const genreNum = Number(get("genre"));
  const genre = Number.isFinite(genreNum) && genreNum > 0 ? genreNum : undefined;
  const yearNum = Number(get("year"));
  const year =
    Number.isFinite(yearNum) && yearNum >= 1900 && yearNum <= 2100
      ? yearNum
      : undefined;
  const ratingNum = Number(get("ratingMin"));
  const ratingMin =
    Number.isFinite(ratingNum) && ratingNum > 0 && ratingNum <= 10
      ? ratingNum
      : undefined;
  const runtimeRaw = get("runtime") as RuntimePreset | undefined;
  const runtime =
    runtimeRaw && runtimeRaw in RUNTIME_PRESETS ? runtimeRaw : undefined;
  const sortRaw = get("sort") as SortKey | undefined;
  const sort: SortKey =
    sortRaw === "top" || sortRaw === "new" ? sortRaw : "popular";
  const pageNum = Number(get("page"));
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  return { type, mood, genre, year, ratingMin, runtime, sort, page };
}

export function buildDiscoverPath(f: WatchNextFilters): string {
  const params = new URLSearchParams();
  params.set("include_adult", "false");
  params.set("page", String(f.page));
  params.set("sort_by", sortByFor(f.type, f.sort));

  const genreIds = new Set<number>();
  if (f.mood) {
    const m = MOODS.find((x) => x.key === f.mood);
    if (m) {
      const ids = f.type === "tv" ? m.tvGenres : m.movieGenres;
      ids.forEach((id) => genreIds.add(id));
    }
  }
  if (f.genre) genreIds.add(f.genre);
  if (genreIds.size > 0) {
    params.set("with_genres", Array.from(genreIds).join(","));
  }

  if (f.year) {
    if (f.type === "tv") params.set("first_air_date_year", String(f.year));
    else params.set("primary_release_year", String(f.year));
  }

  if (f.ratingMin) {
    params.set("vote_average.gte", String(f.ratingMin));
    params.set("vote_count.gte", "50");
  }

  if (f.runtime) {
    const r = RUNTIME_PRESETS[f.runtime];
    if (r.gte) params.set("with_runtime.gte", String(r.gte));
    if (r.lte) params.set("with_runtime.lte", String(r.lte));
  }

  return `/discover/${f.type}?${params.toString()}`;
}

export function buildHref(
  base: string,
  f: Partial<WatchNextFilters> & { type: MediaType },
): string {
  const params = new URLSearchParams();
  params.set("type", f.type);
  if (f.mood) params.set("mood", f.mood);
  if (f.genre) params.set("genre", String(f.genre));
  if (f.year) params.set("year", String(f.year));
  if (f.ratingMin) params.set("ratingMin", String(f.ratingMin));
  if (f.runtime) params.set("runtime", f.runtime);
  if (f.sort && f.sort !== "popular") params.set("sort", f.sort);
  if (f.page && f.page > 1) params.set("page", String(f.page));
  return `${base}?${params.toString()}`;
}
