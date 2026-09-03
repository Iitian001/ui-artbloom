-- =============================================================================
-- ui.artbloom — install counters, saved items, and room for other details.
--
-- RE-RUNNABLE. Every statement is `if not exists`, `or replace`, or guarded by a
-- `drop ... if exists` / catalog lookup. Paste the whole file into the Supabase
-- SQL editor as often as you like; the second run is a no-op.
--
-- WHY THE COUNTER IS NOT INCREMENTED WHERE THE INSTALL HAPPENS
-- `app/r/[name]/route.ts` is `export const dynamic = "force-static"` with
-- `generateStaticParams()`, so every registry payload is prerendered at build
-- time and served from the CDN. Our code does not run on an install fetch, and
-- making it run would mean giving up that fast path for every user of the CLI.
-- Counting therefore happens on a separate, explicit call to
-- `/api/track/install`. That call is client-reported. Read the honesty note at
-- the bottom of this file before you put these numbers on a marketing page.
-- =============================================================================

begin;

-- ─── items ───────────────────────────────────────────────────────────────────
-- One row per registry item, created lazily on first install or first save, so
-- there is no seeding step and no name list to keep in sync with
-- lib/registry/items.ts. A missing row reads as "no data yet", and the app falls
-- back to the seed numbers in that file.
create table if not exists public.items (
  name       text primary key,
  installs   bigint      not null default 0,
  saves      bigint      not null default 0,
  -- The "other details" slot: blurb overrides, badges, editor's notes, whatever
  -- the catalog needs later. Same write rules as the counters — service role
  -- only. Keep it small; this is not a document store.
  meta       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Forward-compat, so re-running this file over an older table adds what is new
-- instead of silently skipping it (`create table if not exists` would).
alter table public.items add column if not exists installs   bigint      not null default 0;
alter table public.items add column if not exists saves      bigint      not null default 0;
alter table public.items add column if not exists meta       jsonb       not null default '{}'::jsonb;
alter table public.items add column if not exists updated_at timestamptz not null default now();

-- `add constraint` has no `if not exists`, so each one is guarded by a catalog
-- lookup. The slug shape matters: it is the second line of defence behind the
-- registry check in app/api/track/install/route.ts. Even if that check were
-- bypassed, `name` cannot become an arbitrary string, so this table cannot be
-- turned into a key/value store by whoever finds the endpoint.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'items_name_is_slug' and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_name_is_slug check (name ~ '^[a-z0-9][a-z0-9-]{0,63}$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'items_counters_non_negative' and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_counters_non_negative check (installs >= 0 and saves >= 0);
  end if;
end $$;

-- ─── saves ───────────────────────────────────────────────────────────────────
-- A user's saved items. `user_id` defaults to auth.uid() so a client never has
-- to send it — and the RLS `with check` below means it cannot send someone
-- else's even if it tries.
create table if not exists public.saves (
  user_id    uuid        not null default auth.uid()
               references auth.users (id) on delete cascade,
  item_name  text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_name)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'saves_item_name_is_slug' and conrelid = 'public.saves'::regclass
  ) then
    alter table public.saves
      add constraint saves_item_name_is_slug check (item_name ~ '^[a-z0-9][a-z0-9-]{0,63}$');
  end if;
end $$;

-- Deliberately no foreign key to public.items: a user can save an item that has
-- never been installed, and public.items rows are created lazily. The trigger
-- further down creates the counter row on the first save instead.
create index if not exists saves_item_name_idx on public.saves (item_name);
create index if not exists saves_user_created_idx on public.saves (user_id, created_at desc);

-- ─── install_events ──────────────────────────────────────────────────────────
-- The dedup ledger. One row per (item, hashed IP, UTC day); the primary key is
-- what enforces "count this install at most once a day from one address", which
-- is enough to stop `for i in {1..1000}; do curl ...; done` from moving a number
-- by more than 1.
--
-- `ip_hash` is a salted SHA-256 computed in the app (lib/analytics/ip.ts) — the
-- raw IP is never sent to Supabase and never stored anywhere. The salt lives in
-- INSTALL_TRACK_SALT (or INSTALL_IP_SALT; either name is read), server-side only.
-- A hash alone is still a pseudonym over a small input space, which is exactly why
-- this table has RLS on and no policies at all: nothing but the service role can
-- read it.
create table if not exists public.install_events (
  item_name  text        not null,
  ip_hash    text        not null,
  -- Filled by its own default, never by the caller, so no client can choose
  -- which day bucket its request lands in.
  day        date        not null default (now() at time zone 'utc')::date,
  -- Reported by the CLI, capped in increment_install(). Diagnostic only; never
  -- trust either value.
  version    text,
  runner     text,
  created_at timestamptz not null default now(),
  primary key (item_name, ip_hash, day)
);

create index if not exists install_events_day_idx on public.install_events (day);
create index if not exists install_events_item_day_idx on public.install_events (item_name, day);

-- ─── increment_install ───────────────────────────────────────────────────────
-- The only way a counter ever moves. `security definer` because public.items has
-- no write policy for any client role (see RLS below) — the function owner does
-- the write, the caller only gets to ask.
--
-- `set search_path` is not decoration: without it, a `security definer` function
-- resolves unqualified names against the *caller's* search_path, and anyone who
-- can create a schema can shadow a table or an operator and have it run as the
-- owner. Every reference below is schema-qualified as well.
--
-- Parameter names are the wire API — PostgREST maps JSON body keys to them — so
-- they match the column names, which makes bare references ambiguous inside
-- PL/pgSQL. `increment_install.x` disambiguates to the parameter. Do not "clean
-- that up"; without it the function raises at runtime, not at create time.
create or replace function public.increment_install(
  item_name text,
  ip_hash   text,
  version   text default null,
  runner    text default null
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted int;
  total    bigint;
begin
  insert into public.install_events (item_name, ip_hash, version, runner)
  values (
    increment_install.item_name,
    increment_install.ip_hash,
    left(increment_install.version, 32),
    left(increment_install.runner, 16)
  )
  on conflict (item_name, ip_hash, day) do nothing;

  get diagnostics inserted = row_count;

  -- Already counted for this address today. Report the current total so the
  -- caller can still show a number, but do not move it.
  if inserted = 0 then
    select i.installs into total from public.items i where i.name = increment_install.item_name;
    return coalesce(total, 0);
  end if;

  -- One statement. Two installs arriving at the same instant cannot both read
  -- the same value and both write value+1: the row is locked for the duration of
  -- the upsert and `t.installs + 1` is evaluated against the locked row, not
  -- against a snapshot read earlier. The insert half is what creates the row on
  -- the very first install, which is why this is an upsert and not a bare update.
  insert into public.items as t (name, installs, updated_at)
  values (increment_install.item_name, 1, now())
  on conflict (name) do update
    set installs   = t.installs + 1,
        updated_at = now()
  returning t.installs into total;

  return total;
end;
$$;

-- ─── saves counter, kept honest by a trigger ─────────────────────────────────
-- items.saves is derived, so it is maintained by the database rather than by the
-- API route. An API that forgot to bump it, or crashed between the insert and
-- the bump, cannot desynchronise the number.
create or replace function public.sync_item_saves()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.items as t (name, saves, updated_at)
    values (new.item_name, 1, now())
    on conflict (name) do update
      set saves      = t.saves + 1,
          updated_at = now();
    return new;
  end if;

  if tg_op = 'DELETE' then
    -- greatest(...) so a manual `delete from saves` on a fresh database cannot
    -- push the counter below zero and trip items_counters_non_negative.
    update public.items
       set saves      = greatest(items.saves - 1, 0),
           updated_at = now()
     where items.name = old.item_name;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists saves_sync_item_counter on public.saves;
create trigger saves_sync_item_counter
  after insert or delete on public.saves
  for each row execute function public.sync_item_saves();

-- ─── maintenance ─────────────────────────────────────────────────────────────
-- install_events grows forever otherwise, and the free tier has a fixed disk.
-- Dropping old rows loses only the dedup memory for days already counted; the
-- totals in public.items are unaffected. Call it from a cron job, or by hand.
create or replace function public.prune_install_events(older_than_days int default 90)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  removed bigint;
begin
  delete from public.install_events
   where day < ((now() at time zone 'utc')::date
                - greatest(prune_install_events.older_than_days, 1));
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- ─── who may execute what ────────────────────────────────────────────────────
-- Every function is granted to PUBLIC by default in PostgreSQL, and `anon`
-- inherits that. Revoking from PUBLIC first is the step people forget; without
-- it, `security definer` hands a counter-increment primitive to anyone holding
-- the anon key, which ships in the browser bundle.
revoke all on function public.increment_install(text, text, text, text) from public;
revoke all on function public.increment_install(text, text, text, text) from anon, authenticated;
grant execute on function public.increment_install(text, text, text, text) to service_role;

revoke all on function public.prune_install_events(int) from public;
revoke all on function public.prune_install_events(int) from anon, authenticated;
grant execute on function public.prune_install_events(int) to service_role;

-- sync_item_saves is a trigger function; nothing should ever call it directly.
revoke all on function public.sync_item_saves() from public;
revoke all on function public.sync_item_saves() from anon, authenticated;

-- ─── row level security ──────────────────────────────────────────────────────
-- Read this together with the grants below. A statement has to pass BOTH the
-- table grant and a policy, so each one is a separate mistake that has to be
-- made before anything is exposed.
--
-- One thing RLS does NOT constrain: `service_role`. That key bypasses row level
-- security by design, and app/api/** holds it. Which is why the registry-name
-- check and the rate limit in app/api/track/install/route.ts are load-bearing
-- rather than belt-and-braces — they are the only thing standing between a
-- request and a service-role write.
alter table public.items          enable row level security;
alter table public.saves          enable row level security;
alter table public.install_events enable row level security;

-- items — public read, no client writes at all.
revoke all on table public.items from anon, authenticated;
grant select on table public.items to anon, authenticated;
grant all    on table public.items to service_role;

-- saves — anon gets nothing, an authenticated user gets exactly three verbs.
revoke all on table public.saves from anon, authenticated;
grant select, insert, delete on table public.saves to authenticated;
grant all on table public.saves to service_role;

-- install_events — no client grant of any kind. The ledger holds pseudonymous
-- address hashes, and a hash over the IPv4 space is not anonymity.
revoke all on table public.install_events from anon, authenticated;
grant all on table public.install_events to service_role;

drop policy if exists items_public_read on public.items;
create policy items_public_read
  on public.items for select
  to anon, authenticated
  using (true);
comment on policy items_public_read on public.items is
  'Counters are public, so this allows every read. What it prevents is nothing — the protection is the absence of any insert/update/delete policy on this table: a client holding the anon or a user key cannot move a counter at all, only increment_install() can, and only the service role may execute that.';

drop policy if exists saves_select_own on public.saves;
create policy saves_select_own
  on public.saves for select
  to authenticated
  using (auth.uid() = user_id);
comment on policy saves_select_own on public.saves is
  'Prevents one signed-in user reading another user''s saved list by asking for it — e.g. GET /rest/v1/saves?user_id=eq.<someone-else>, which returns zero rows rather than their library. Also prevents an anonymous caller enumerating the table at all, since auth.uid() is null and null = user_id is not true.';

drop policy if exists saves_insert_own on public.saves;
create policy saves_insert_own
  on public.saves for insert
  to authenticated
  with check (auth.uid() = user_id);
comment on policy saves_insert_own on public.saves is
  'Prevents writing a row into somebody else''s library. The column default is auth.uid() so an honest client never sends user_id; this is what happens when a dishonest one does. Combined with the primary key it also means a save cannot be duplicated.';

drop policy if exists saves_delete_own on public.saves;
create policy saves_delete_own
  on public.saves for delete
  to authenticated
  using (auth.uid() = user_id);
comment on policy saves_delete_own on public.saves is
  'Prevents un-saving items out of another user''s library, which would also silently decrement items.saves through the trigger.';

-- No UPDATE policy, deliberately: a save has nothing mutable about it. Adding
-- one later would be the only way to let a user rewrite created_at or move a row
-- between items, so an UPDATE is refused outright instead.
--
-- No policies at all on install_events, deliberately: RLS is enabled, so with no
-- policy every anon/authenticated read and write is denied. Only the service
-- role, which bypasses RLS, can touch it.

commit;

-- =============================================================================
-- HOW ACCURATE IS `items.installs`? Read this before it goes on a landing page.
--
-- It is a client-reported number. Nothing in this schema can verify that an
-- install happened, because the thing being installed is a static file on a CDN
-- that our code never sees fetched. What the schema does is make inflation cost
-- something:
--
--   * the (item_name, ip_hash, day) primary key caps one address at +1 per item
--     per day, so a loop from one machine adds 1, not 1000;
--   * items_name_is_slug means only real-looking names can ever appear;
--   * only the service role can execute increment_install, so leaking the anon
--     key does not leak the ability to write a counter.
--
-- What it does NOT stop: anyone with a few hundred IP addresses — a botnet, a
-- proxy pool, a cheap VPN with rotation, or IPv6 where a single /64 is an
-- effectively unlimited supply of distinct addresses. Those add one legitimate-
-- looking install each per day. Treat these figures as popularity signal, not as
-- an audited metric, and never as a number a third party should rely on.
--
-- The trustworthy comparison: npm's own download counts
-- (https://api.npmjs.org/downloads/point/last-week/ui.artbloom) are computed by
-- npm from its own registry logs. Nobody, including us, can write to them. If
-- the site needs one number that cannot be gamed, that is the one to show.
-- =============================================================================
