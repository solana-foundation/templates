create table if not exists public.indexed_program_accounts (
  network text not null,
  program_id text not null,
  account_address text not null,
  owner text not null,
  lamports numeric(20, 0) not null check (lamports >= 0),
  executable boolean not null default false,
  rent_epoch numeric(20, 0),
  data_base64 text not null,
  data_size integer not null check (data_size >= 0),
  slot numeric(20, 0) not null check (slot >= 0),
  first_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (network, program_id, account_address)
);

create index if not exists indexed_program_accounts_recent_idx
  on public.indexed_program_accounts (network, program_id, updated_at desc);

create index if not exists indexed_program_accounts_lamports_idx
  on public.indexed_program_accounts (network, program_id, lamports desc);

create index if not exists indexed_program_accounts_owner_idx
  on public.indexed_program_accounts (owner);

create index if not exists indexed_program_accounts_address_prefix_idx
  on public.indexed_program_accounts (network, program_id, account_address text_pattern_ops);

create or replace function public.preserve_newest_indexed_program_account()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slot < old.slot then
    return null;
  end if;

  return new;
end;
$$;

drop trigger if exists preserve_newest_indexed_program_account
  on public.indexed_program_accounts;

create trigger preserve_newest_indexed_program_account
  before update on public.indexed_program_accounts
  for each row
  execute function public.preserve_newest_indexed_program_account();

create or replace view public.indexed_program_accounts_read
with (security_invoker = true)
as
select
  network,
  program_id,
  account_address,
  owner,
  lamports::text as lamports,
  lamports as lamports_numeric,
  executable,
  rent_epoch::text as rent_epoch,
  data_base64,
  data_size,
  slot::text as slot,
  first_seen_at,
  updated_at
from public.indexed_program_accounts;

revoke all on public.indexed_program_accounts_read from public;
grant select on public.indexed_program_accounts_read to anon, authenticated, service_role;

alter table public.indexed_program_accounts enable row level security;

drop policy if exists "Indexed accounts are publicly readable"
  on public.indexed_program_accounts;

create policy "Indexed accounts are publicly readable"
  on public.indexed_program_accounts
  for select
  to anon, authenticated
  using (true);

-- The service-role client used by scripts/indexer.ts bypasses RLS. Do not add
-- anonymous insert/update policies or expose the service key to the browser.

alter table public.indexed_program_accounts replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.indexed_program_accounts;
exception
  when duplicate_object then null;
end
$$;
