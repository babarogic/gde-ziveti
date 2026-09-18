create extension if not exists pgcrypto;

create table if not exists public.couple_workspaces (
  id uuid primary key default gen_random_uuid(),
  invite_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  workspace_id uuid not null references public.couple_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'partner')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.couple_data (
  workspace_id uuid primary key references public.couple_workspaces(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.couple_workspaces enable row level security;
alter table public.couple_members enable row level security;
alter table public.couple_data enable row level security;

create or replace function public.is_couple_member(target_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.couple_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
  );
$$;

revoke all on function public.is_couple_member(uuid) from public;
grant execute on function public.is_couple_member(uuid) to authenticated;

drop policy if exists "Members can read their workspace" on public.couple_workspaces;
create policy "Members can read their workspace"
on public.couple_workspaces for select
to authenticated
using (public.is_couple_member(id));

drop policy if exists "Members can read their membership" on public.couple_members;
create policy "Members can read their membership"
on public.couple_members for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Members can read couple data" on public.couple_data;
create policy "Members can read couple data"
on public.couple_data for select
to authenticated
using (public.is_couple_member(workspace_id));

drop policy if exists "Members can create couple data" on public.couple_data;
create policy "Members can create couple data"
on public.couple_data for insert
to authenticated
with check (public.is_couple_member(workspace_id));

drop policy if exists "Members can update couple data" on public.couple_data;
create policy "Members can update couple data"
on public.couple_data for update
to authenticated
using (public.is_couple_member(workspace_id))
with check (public.is_couple_member(workspace_id));

create or replace function public.create_couple_workspace()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.couple_workspaces default values
  returning id into new_workspace_id;

  insert into public.couple_members (workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'owner');

  insert into public.couple_data (workspace_id)
  values (new_workspace_id);

  return new_workspace_id;
end;
$$;

create or replace function public.join_couple_workspace(provided_invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_workspace_id uuid;
  member_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id into target_workspace_id
  from public.couple_workspaces
  where invite_token = provided_invite_token
  for update;

  if target_workspace_id is null then
    raise exception 'Invite is not valid';
  end if;

  if public.is_couple_member(target_workspace_id) then
    return target_workspace_id;
  end if;

  select count(*) into member_count
  from public.couple_members
  where workspace_id = target_workspace_id;

  if member_count >= 2 then
    raise exception 'This couple workspace already has two members';
  end if;

  insert into public.couple_members (workspace_id, user_id, role)
  values (target_workspace_id, auth.uid(), 'partner');

  return target_workspace_id;
end;
$$;

revoke all on function public.create_couple_workspace() from public;
revoke all on function public.join_couple_workspace(text) from public;
grant execute on function public.create_couple_workspace() to authenticated;
grant execute on function public.join_couple_workspace(text) to authenticated;

grant select on public.couple_workspaces to authenticated;
grant select on public.couple_members to authenticated;
grant select, insert, update on public.couple_data to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.couple_data;
exception
  when duplicate_object then null;
end $$;
