-- Mosaic LifeOS Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor to set up cloud sync database tables and Row Level Security (RLS) policies.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  user_name text,
  theme text default 'system',
  accent_color text default '#68735C',
  greeting text default 'Good day',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 2. Areas Table
create table if not exists public.areas (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default 'Compass',
  color text default '#68735C',
  description text,
  is_custom boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone
);

alter table public.areas enable row level security;

create policy "Users can manage own areas" on public.areas
  for all using (auth.uid() = user_id);

-- 3. Projects Table
create table if not exists public.projects (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  area_id text references public.areas(id) on delete set null,
  name text not null,
  description text,
  status text default 'active',
  deadline text,
  milestones jsonb default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.projects enable row level security;

create policy "Users can manage own projects" on public.projects
  for all using (auth.uid() = user_id);

-- 4. Tasks Table
create table if not exists public.tasks (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  project_id text references public.projects(id) on delete set null,
  area_id text references public.areas(id) on delete set null,
  goal_id text,
  title text not null,
  description text,
  due_date text,
  due_time text,
  priority text default 'medium',
  status text default 'todo',
  recurrence jsonb,
  subtasks jsonb default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.tasks enable row level security;

create policy "Users can manage own tasks" on public.tasks
  for all using (auth.uid() = user_id);

-- 5. Journal Entries Table
create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text,
  content text not null,
  mood integer,
  tags text[] default array[]::text[],
  area_id text references public.areas(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.journal_entries enable row level security;

create policy "Users can manage own journal entries" on public.journal_entries
  for all using (auth.uid() = user_id);

-- 6. Daily Logs Table
create table if not exists public.daily_logs (
  date text primary key, -- YYYY-MM-DD
  user_id uuid references auth.users on delete cascade not null,
  freeform_note text default '',
  mood integer,
  energy integer,
  focus integer,
  wins text[] default array[]::text[],
  problems text[] default array[]::text[],
  tomorrow_intention text default '',
  manual_timeline jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.daily_logs enable row level security;

create policy "Users can manage own daily logs" on public.daily_logs
  for all using (auth.uid() = user_id);

-- 7. Habits Table
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  frequency text default 'daily',
  target_count integer default 1,
  area_id text references public.areas(id) on delete set null,
  goal_id text,
  start_date text not null,
  notes text,
  completion_history jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone
);

alter table public.habits enable row level security;

create policy "Users can manage own habits" on public.habits
  for all using (auth.uid() = user_id);

-- 8. Calendar Events Table
create table if not exists public.events (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  area_id text references public.areas(id) on delete set null,
  project_id text references public.projects(id) on delete set null,
  title text not null,
  start_date text not null,
  end_date text,
  start_time text,
  end_time text,
  is_all_day boolean default false,
  location text,
  recurrence jsonb,
  notes text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;

create policy "Users can manage own events" on public.events
  for all using (auth.uid() = user_id);

-- 9. Goals Table
create table if not exists public.goals (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  area_id text references public.areas(id) on delete set null,
  parent_goal_id text,
  title text not null,
  description text,
  tier text default 'yearly',
  target_date text,
  progress integer default 0,
  status text default 'active',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

create policy "Users can manage own goals" on public.goals
  for all using (auth.uid() = user_id);
