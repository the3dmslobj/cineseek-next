export function dateFormatter(
  inputDate: string | undefined,
  options: Intl.DateTimeFormatOptions
): string {
  if (!inputDate) return "";
  return new Date(inputDate).toLocaleDateString("en-US", options);
}

export function ratingFormatter(rating: number | string | undefined): string {
  const n = Number(rating);
  if (!Number.isFinite(n) || n === 0) return "";
  return `TMDB Rating - ${n.toFixed(1)} / 10`;
}

export function trimText(str: string | undefined, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  const trimmed = str.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "...";
}
