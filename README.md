# Cineseek (Next.js)

A Next.js port of the original [Cineseek](https://github.com/the3dmslobj/cineseek) Vite + React project. Browse trending movies, now playing, top-rated movies and series, and search across TMDB.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- FontAwesome icons
- [TMDB API](https://developer.themoviedb.org/) (v4 read access token)

## Getting started

1. Copy the env example and add your TMDB v4 read access token:

   ```bash
   cp .env.example .env.local
   # then edit .env.local
   ```

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — Trending hero carousel, Now Playing carousel, Top-Rated grids |
| `/details/[type]/[id]` | Movie or TV details (`type` is `movie` or `tv`) |
| `/person/[id]` | Person details with filmography |
| `/results?type=&query=&page=` | Search results, paginated |

## Project structure

```
app/
  layout.tsx                    Root layout (FontAwesome CSS, fonts)
  globals.css                   Tailwind v4 + custom @theme tokens
  page.tsx                      Home
  components/                   Shared UI (Navbar, Footer, carousels, etc.)
  details/[type]/[id]/page.tsx  Movie/TV details
  person/[id]/page.tsx          Person details
  results/page.tsx              Search results
lib/
  tmdb.ts                       Authenticated TMDB fetch wrapper
  utils.ts                      Date / rating / trim helpers
  carousel.ts                   Infinite-loop carousel logic
public/                         Logo SVGs
```

Pages and `TopRated` are server components — they fetch from TMDB on the server. `Navbar`, `TrendingCarousel`, and `NowPlayingCarousel` are client components for interactivity. The home page is `force-dynamic` so the build does not require a TMDB token.
