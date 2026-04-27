const TMDB_BASE = "https://api.themoviedb.org/3";

export const TMDB_IMG = "https://image.tmdb.org/t/p/original";

export const FALLBACK_POSTER = "https://dummyimage.com/600x900/000000/000000.png";
export const FALLBACK_PROFILE = "https://dummyimage.com/600x900/1f1f1f/1f1f1f.png";

export async function tmdb<T>(path: string): Promise<T> {
  const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const sep = path.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE}${path}${sep}language=en-US`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json() as Promise<T>;
}
