-- og-images bucket — holds the client-generated Open Graph cards so
-- crawlers (WhatsApp, Discord, X, …) can read a real per-collection preview
-- image. Run once in the Supabase SQL editor (it is idempotent).

insert into storage.buckets (id, name, public)
values ('og-images', 'og-images', true)
on conflict (id) do nothing;
