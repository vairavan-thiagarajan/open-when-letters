-- Email delivery log + dedup table.
-- Run this in the Supabase SQL editor once (it is idempotent).
--
-- Every email the server sends through Resend records a row here:
--   * `dedupe_key` is unique so retries can never send a duplicate.
--   * status 'sent'   → the email is considered delivered; further attempts
--                       with the same dedupe_key are skipped.
--   * status 'failed' → a later attempt is allowed (the failure is logged).
-- This satisfies both "never send duplicate emails" and "log all failures".

create table if not exists public.email_log (
  id          uuid primary key default gen_random_uuid(),
  dedupe_key  text not null unique,
  event       text not null,
  recipient   text not null,
  status      text not null check (status in ('sent', 'failed')),
  error       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists email_log_status_idx
  on public.email_log (status);

create index if not exists email_log_created_at_idx
  on public.email_log (created_at desc);

-- Locked down: only the server (service role) can read or write this table.
-- Client-side anon/authenticated requests are denied.
alter table public.email_log enable row level security;
