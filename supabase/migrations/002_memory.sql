-- "The Memory" migration — optional photo attached to a letter.
-- Run this in the Supabase SQL editor once (it is idempotent).

-- Letters: optional memory image URL (empty = no memory section shown)
alter table public.letters
  add column if not exists memory_image_url text not null default '';

-- Public storage bucket for uploaded memories
insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do nothing;
