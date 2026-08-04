-- Premium polish migration for existing databases.
-- Run this in the Supabase SQL editor once (it is idempotent).

-- Collections ------------------------------------------------------------
alter table public.collections
  add column if not exists primary_color text not null default '',
  add column if not exists accent_color  text not null default '',
  add column if not exists font_pair     text not null default 'auto',
  add column if not exists password_hash text not null default '',
  add column if not exists music_url     text not null default '',
  add column if not exists visibility    text not null default 'public';

-- Legacy rows used theme='blush'; map to the new default theme id.
update public.collections set theme = 'rose' where theme not in (
  'rose', 'minimal', 'vintage', 'night', 'ocean', 'forest', 'cream', 'dark-elegance'
);

-- Letters -----------------------------------------------------------------
alter table public.letters
  add column if not exists unlock_type text not null default 'immediate',
  add column if not exists unlock_at   timestamptz null;
