-- ============================================================================
-- Open When Letters — Supabase schema
--
-- Run this in the Supabase SQL editor.
--
-- Future auth note:
--   `collections.user_id` already exists (nullable). When authentication is
--   added, simply populate it on insert and tighten the RLS policies below so
--   only the owner (or visitors with a valid edit_token) can modify rows.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- collections
-- ----------------------------------------------------------------------------
create table if not exists public.collections (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null default '',
  cover_image   text not null default '0',
  theme         text not null default 'rose',
  edit_token    text not null unique,
  user_id       uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Premium settings -----------------------------------------------------
  primary_color text not null default '',
  accent_color  text not null default '',
  font_pair     text not null default 'auto',
  password_hash text not null default '',
  music_url     text not null default '',
  visibility    text not null default 'public'
);

-- ----------------------------------------------------------------------------
-- letters
-- ----------------------------------------------------------------------------
create table if not exists public.letters (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  title         text not null default '',
  trigger       text not null default '',
  body          text not null default '',
  icon          text not null default '❤️',
  cover_image   text not null default '0',
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  -- Scheduling -----------------------------------------------------------
  unlock_type   text not null default 'immediate',
  unlock_at     timestamptz null,
  -- The Memory -----------------------------------------------------------
  memory_image_url text not null default ''
);

create index if not exists letters_collection_idx
  on public.letters (collection_id);

create index if not exists letters_collection_position_idx
  on public.letters (collection_id, position);

-- ----------------------------------------------------------------------------
-- touch the collection whenever its letters change (keeps updated_at fresh)
-- ----------------------------------------------------------------------------
create or replace function public.touch_collection()
returns trigger
language plpgsql
as $$
begin
  update public.collections
     set updated_at = now()
   where id = coalesce(NEW.collection_id, OLD.collection_id);
  return NEW;
end;
$$;

drop trigger if exists letters_touch_collection on public.letters;
create trigger letters_touch_collection
  after insert or update or delete on public.letters
  for each row execute function public.touch_collection();

-- ----------------------------------------------------------------------------
-- Storage: public bucket for letter memories
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- MVP: no auth. Anyone may read, and writes are only reachable through the
-- secret edit links. When auth is added, tighten these policies to check
-- auth.uid() = user_id (or edit_token) instead of allowing everything.
-- ----------------------------------------------------------------------------
alter table public.collections enable row level security;
alter table public.letters enable row level security;

drop policy if exists "collections_select" on public.collections;
create policy "collections_select"
  on public.collections for select
  using (true);

drop policy if exists "collections_insert" on public.collections;
create policy "collections_insert"
  on public.collections for insert
  with check (true);

drop policy if exists "collections_update" on public.collections;
create policy "collections_update"
  on public.collections for update
  using (true);

drop policy if exists "collections_delete" on public.collections;
create policy "collections_delete"
  on public.collections for delete
  using (true);

drop policy if exists "letters_select" on public.letters;
create policy "letters_select"
  on public.letters for select
  using (true);

drop policy if exists "letters_insert" on public.letters;
create policy "letters_insert"
  on public.letters for insert
  with check (true);

drop policy if exists "letters_update" on public.letters;
create policy "letters_update"
  on public.letters for update
  using (true);

drop policy if exists "letters_delete" on public.letters;
create policy "letters_delete"
  on public.letters for delete
  using (true);
