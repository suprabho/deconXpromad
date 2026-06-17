-- Deconflict Visual Studio — Supabase schema.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- Both tables are reached ONLY through the server-side service-role client
-- (lib/composition/supabase-server.ts); RLS is enabled with no policies, so the
-- public anon key can't read or write them directly.

-- Short-lived config handoff between the export route and the /render route on
-- serverless (separate invocations with no shared memory). Rows are deleted as
-- soon as the screenshot is taken; orphans age out after ~5 min.
create table if not exists export_handoff (
  id uuid primary key,
  config jsonb not null,
  created_at timestamptz not null default now()
);
alter table export_handoff enable row level security;

-- Durable saved compositions — the user's library. No TTL. `size_id` is
-- denormalised from config.sizeId so the list query stays cheap (configs carry
-- data-URL images and can be megabytes).
create table if not exists compositions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size_id text not null default 'og',
  config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table compositions enable row level security;

create index if not exists compositions_updated_at_idx on compositions (updated_at desc);
