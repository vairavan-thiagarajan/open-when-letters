-- "Letter Studio" migration — per-letter decorations for the builder.
-- Run this in the Supabase SQL editor once (it is idempotent).

-- Letters: studio columns
--   font         chosen letter font id ('' = default look)
--   background   '' (none), 'preset:<id>', or 'url:<publicUrl>'
--   stickers     jsonb array of placed stickers
--   photos       jsonb array of placed decorative photos
--   audio_url    optional per-letter audio ('' = none)
alter table public.letters
  add column if not exists font text not null default '',
  add column if not exists background text not null default '',
  add column if not exists stickers jsonb not null default '[]',
  add column if not exists photos jsonb not null default '[]',
  add column if not exists audio_url text not null default '';

-- Public storage bucket for uploaded backgrounds, photos & audio
insert into storage.buckets (id, name, public)
values ('letter-decor', 'letter-decor', true)
on conflict (id) do nothing;
