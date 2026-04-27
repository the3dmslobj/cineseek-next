# Cineseek

A school-project movie database. Browse trending films, now-playing, top-rated movies and series; sign up to save and mark titles as watched. Originally a [Vite + React prototype](https://github.com/the3dmslobj/cineseek), rewritten in Next.js with a brutalist terminal redesign.

> Live data from [TMDB](https://developer.themoviedb.org/), auth + library via [Supabase](https://supabase.com), deployed-friendly on Vercel.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, FontAwesome (free-solid) |
| Typography | JetBrains Mono (body), Space Grotesk (display) |
| Data | TMDB v3 REST API (v4 read-access bearer token) |
| Auth + DB | Supabase (auth.users + a single `library` table with RLS) |
| Lang | TypeScript |

## Features

- **Editorial hero** that auto-cycles through 5 trending movies every 7 s, with title, tagline, genre / year / runtime / rating chips, and a framed poster card showing director · year · runtime · rating.
- **Marquee strip** of trending titles below the hero.
- **Now Playing** horizontal scroller and **Top-Rated** grids for both films and series.
- **Details page** with poster (corner labels: id / year / FLM·SER / rating), italic tagline, chips, save / mark-watched buttons, director-linked metadata grid, cast scroller (real photos, initials fallback), and a recommendations row.
- **Person page** with profile photo (or initials), bio, BORN / FROM / DIED / CREDITS metadata, and full filmography H-scroll.
- **Search** with desktop inline bar (M/S toggle, live suggestions dropdown) and mobile `SEARCH.MOD` modal. Empty queries fall back to TMDB `/popular`.
- **Auth** as a single floating `AUTH/SIGNIN.MOD` modal that toggles between log in and sign up. The Save / Watched buttons open the same modal when signed out.
- **Profile page** with initials avatar, member-since label, saved + watched counts, tabs, empty states, and sign-out.
- **Theme switcher** (sun / moon button in the navbar) — dark `#0a0a0a` / lime `#c6ff00` accent, light `#f4f4f1` / indigo `#3300ff` accent. Persisted to `localStorage`.

## Routes

| Path | What |
| --- | --- |
| `/` | Hero + marquee + Now Playing + Top-Rated films + Top-Rated series |
| `/details/[type]/[id]` | Movie or TV details (`type` ∈ `movie` \| `tv`) |
| `/person/[id]` | Person profile + filmography |
| `/results?type=&query=&page=` | Search results, paginated. Empty `query` shows the popular pool. |
| `/profile` | Signed-in user's saved + watched lists |

## Project structure

```
app/
├── layout.tsx                  Root: ThemeProvider, AuthProvider, FontAwesome CSS
├── globals.css                 Tailwind v4 + design tokens (--bg, --ink, --accent, …) + utility classes (.cap, .tag, .btn, .pcard, .frame, .field, .display, .modal, .marquee, .noise, .h-scroll)
├── icon.svg                    Favicon (C-mark)
├── page.tsx                    Home
├── components/
│   ├── Navbar.tsx              Sticky header, search, theme toggle, auth entry
│   ├── Footer.tsx              Links + GitHub credit
│   ├── ThemeProvider.tsx       data-theme on <html>, persisted
│   ├── AuthProvider.tsx        Supabase auth state via React context
│   ├── AuthModal.tsx           Floating sign-in / sign-up modal
│   ├── Avatar.tsx              Initials in a bordered square
│   ├── PosterCard.tsx          Frame + TMDB poster + corner labels
│   ├── SectionLabel.tsx        § NN + display heading + [count]
│   ├── HRow.tsx                Horizontal scroller with prev/next
│   ├── Trending.tsx            Server: fetch trending + details + credits
│   ├── TrendingHero.tsx        Client: auto-cycling hero
│   ├── NowPlaying.tsx          Server: fetch + render HRow
│   ├── TopRated.tsx            Server: two grids (films + series)
│   ├── LibraryButtons.tsx      Save / Watched action buttons
│   └── LibraryGrid.tsx         Saved / Watched poster grid for the profile page
├── details/[type]/[id]/page.tsx
├── person/[id]/page.tsx
├── results/page.tsx
└── profile/page.tsx
lib/
├── tmdb.ts                     fetch wrapper with the bearer token + 1 h revalidate
├── utils.ts                    dateFormatter / ratingFormatter / trimText
├── supabase.ts                 Browser-side Supabase client
└── library.ts                  add / remove / list / get for the library table
public/                         cineseek-logo SVGs
```

## Getting started

### 1. Get a TMDB v4 read-access token

Create a [TMDB account](https://www.themoviedb.org/), then in **Settings → API** copy the **API Read Access Token (v4 auth)**.

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. **Authentication → Providers → Email**: uncheck *Confirm email* (so demo sign-ups work without an email round-trip).
3. **SQL Editor**: run

   ```sql
   create table library (
     user_id uuid references auth.users(id) on delete cascade,
     movie_id int not null,
     media_type text not null check (media_type in ('movie', 'tv')),
     status text not null check (status in ('saved', 'watched')),
     added_at timestamptz default now(),
     primary key (user_id, movie_id, media_type)
   );
   alter table library enable row level security;
   create policy "users manage own library" on library
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```
4. From **Settings → API**, copy the **Project URL** and **anon public** key.

### 3. Configure local env

```bash
cp .env.example .env.local
# fill in:
# NEXT_PUBLIC_TMDB_API_KEY=...
# NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. Install + run

```bash
npm install
npm run dev
```

http://localhost:3000.

## Database

Single table, owned by Supabase auth users via RLS — every row is scoped to the signed-in user automatically.

```
library
├── user_id     uuid     FK -> auth.users(id), on delete cascade
├── movie_id    int                   TMDB id
├── media_type  text                  'movie' | 'tv'
├── status      text                  'saved' | 'watched'
├── added_at    timestamptz           default now()
└── PRIMARY KEY (user_id, movie_id, media_type)
```

`addToLibrary` / `removeFromLibrary` / `listLibrary(status?)` / `getEntry` live in `lib/library.ts`.

## Design tokens

Defined as CSS custom properties on `:root` and `html[data-theme="light"]`, then exposed to Tailwind v4 via `@theme inline`:

| Token | Dark | Light |
| --- | --- | --- |
| `--bg` | `#0a0a0a` | `#f4f4f1` |
| `--panel` | `#111111` | `#ffffff` |
| `--line` | `#262626` | `#1a1a1a` |
| `--ink` | `#ededed` | `#0a0a0a` |
| `--ink-2` | `#9a9a9a` | `#3a3a3a` |
| `--ink-3` | `#5a5a5a` | `#7a7a7a` |
| `--accent` | `#c6ff00` (lime) | `#3300ff` (indigo) |

Legacy `color1`–`color5` and `font-dmSans/raleway/robotoMono/robotoFlex` from the original Vite project are remapped to the new tokens for compatibility.

## Server vs client components

- **Server**: every page (`app/page.tsx`, `details`, `person`, `results`, `profile` is mostly server-rendered with a small client island), `Trending`, `NowPlaying`, `TopRated`, `Footer`, `PosterCard`, `SectionLabel`, `Avatar`. They `await tmdb(...)` directly with the token kept on the server side.
- **Client (`"use client"`)**: `Navbar`, `TrendingHero`, `HRow`, `AuthProvider`, `AuthModal`, `LibraryButtons`, `LibraryGrid`, `ThemeProvider`. They handle interactivity and Supabase auth state.
- The home page is `force-dynamic` so production builds don't need a live TMDB token.

## Notes

- Posters are rendered as plain `<img>` (ESLint's `no-img-element` is disabled) instead of `next/image` to keep the demo simple — TMDB's CDN does its own optimisation.
- Auth + library are intentionally exposed via the public Supabase anon key. RLS policies on the `library` table enforce per-user isolation, so the anon key alone can't read other users' rows.
- No backwards-compat shims, no test suite, no analytics. School project.

## Credits

- TMDB for the data — please [credit them](https://developer.themoviedb.org/docs/faq#what-are-the-attribution-requirements) if you fork this.
- Original [Cineseek](https://github.com/the3dmslobj/cineseek) prototype by [the3dmslobj](https://github.com/the3dmslobj).
