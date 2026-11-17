-- Script SQL à exécuter dans Supabase > SQL Editor
create table if not exists public.advent_calendars (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.advent_calendars enable row level security;

create policy "Lecture publique du calendrier"
  on public.advent_calendars for select
  to anon, authenticated
  using (true);

create policy "Création publique du calendrier"
  on public.advent_calendars for insert
  to anon, authenticated
  with check (true);

create policy "Mise à jour publique du calendrier"
  on public.advent_calendars for update
  to anon, authenticated
  using (true)
  with check (true);
