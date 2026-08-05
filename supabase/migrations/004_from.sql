-- "From" migration — the sender's name shown as the signature on the
-- shared collection page. Run this in the Supabase SQL editor once
-- (it is idempotent).

alter table public.collections
  add column if not exists "from" text not null default '';
