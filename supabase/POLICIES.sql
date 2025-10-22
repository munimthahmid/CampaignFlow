-- CampaignFlow RLS Policies
-- Enable row level security and allow users to access only their rows.

alter table public.tasks enable row level security;

-- Drop existing policies if re-running
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Can view own tasks') then
    drop policy "Can view own tasks" on public.tasks;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Can insert own tasks') then
    drop policy "Can insert own tasks" on public.tasks;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Can update own tasks') then
    drop policy "Can update own tasks" on public.tasks;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Can delete own tasks') then
    drop policy "Can delete own tasks" on public.tasks;
  end if;
end $$;

create policy "Can view own tasks" on public.tasks
  for select using (user_id = auth.uid());

create policy "Can insert own tasks" on public.tasks
  for insert with check (user_id = auth.uid());

create policy "Can update own tasks" on public.tasks
  for update using (user_id = auth.uid());

create policy "Can delete own tasks" on public.tasks
  for delete using (user_id = auth.uid());

