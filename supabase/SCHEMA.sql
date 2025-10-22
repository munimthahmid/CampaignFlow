-- CampaignFlow Tasks Schema
-- Run this in Supabase SQL editor.

begin;

-- Ensure required extension for UUIDs
create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  priority text not null default 'Medium' check (priority in ('High','Medium','Low')),
  status text not null default 'Backlog' check (status in ('Backlog','In Progress','Awaiting Approval','Done')),
  influencer jsonb not null,
  due_date timestamptz null,
  assignees jsonb null,
  budget numeric null,
  deliverable text null check (deliverable in ('Post','Story','Reel','Short')),
  links jsonb null,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_tasks_user_priority on public.tasks(user_id, priority);
create index if not exists idx_tasks_due_date on public.tasks(due_date);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

commit;

