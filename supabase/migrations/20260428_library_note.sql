-- Adds a free-form note field to library entries.
-- Note is meaningful when status = 'watched' but persists across status changes.
alter table public.library
  add column if not exists note text;
