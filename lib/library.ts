import { supabase } from "./supabase";

export type LibraryStatus = "saved" | "watched";
export type MediaType = "movie" | "tv";

export type LibraryEntry = {
  movie_id: number;
  media_type: MediaType;
  status: LibraryStatus;
  added_at: string;
};

export async function addToLibrary(
  movieId: number,
  mediaType: MediaType,
  status: LibraryStatus
) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { error } = await supabase.from("library").upsert({
    user_id: userId,
    movie_id: movieId,
    media_type: mediaType,
    status,
  });
  if (error) throw error;
}

export async function removeFromLibrary(movieId: number, mediaType: MediaType) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { error } = await supabase
    .from("library")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType);
  if (error) throw error;
}

export async function listLibrary(status?: LibraryStatus): Promise<LibraryEntry[]> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return [];

  let query = supabase
    .from("library")
    .select("movie_id, media_type, status, added_at")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as LibraryEntry[];
}

export async function getEntry(
  movieId: number,
  mediaType: MediaType
): Promise<LibraryEntry | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("library")
    .select("movie_id, media_type, status, added_at")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as LibraryEntry | null;
}
