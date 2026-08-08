-- ISOOKO schema
-- Run this once in Supabase: Dashboard > SQL Editor > New query > Paste > Run
-- Safe to re-run: CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS.
-- Columns are lowercase because PostgreSQL folds unquoted identifiers.

create table if not exists public.admins (
  id text primary key,
  username text not null,
  passwordhash text not null,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.programs (
  id text primary key,
  icon text,
  titlekey text,
  subtitlekey text,
  desckey text,
  offeringskey text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.events (
  id text primary key,
  titlekey text,
  date text,
  time text,
  locationkey text,
  desckey text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.blog_posts (
  id text primary key,
  slug text,
  titlekey text,
  excerptkey text,
  contentkey text,
  date text,
  author text,
  featuredimage text,
  category text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.team_members (
  id text primary key,
  name text,
  rolekey text,
  photo text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.gallery_images (
  id text primary key,
  src text,
  altkey text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.impact_stats (
  id text primary key,
  value numeric,
  suffix text,
  labelkey text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.testimonials (
  id text primary key,
  quotekey text,
  attribution text,
  rolekey text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.contacts (
  id text primary key,
  name text,
  email text,
  subject text,
  message text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.volunteers (
  id text primary key,
  name text,
  email text,
  phone text,
  areaofinterest text,
  message text,
  createdat timestamptz,
  updatedat timestamptz
);

-- Add any columns missing on tables that already exist.
alter table public.programs add column if not exists icon text;
alter table public.programs add column if not exists titlekey text;
alter table public.programs add column if not exists subtitlekey text;
alter table public.programs add column if not exists desckey text;
alter table public.programs add column if not exists offeringskey text;
alter table public.programs add column if not exists updatedat timestamptz;

alter table public.events add column if not exists titlekey text;
alter table public.events add column if not exists time text;
alter table public.events add column if not exists locationkey text;
alter table public.events add column if not exists desckey text;
alter table public.events add column if not exists updatedat timestamptz;

alter table public.blog_posts add column if not exists slug text;
alter table public.blog_posts add column if not exists titlekey text;
alter table public.blog_posts add column if not exists excerptkey text;
alter table public.blog_posts add column if not exists contentkey text;
alter table public.blog_posts add column if not exists date text;
alter table public.blog_posts add column if not exists author text;
alter table public.blog_posts add column if not exists featuredimage text;
alter table public.blog_posts add column if not exists category text;
alter table public.blog_posts add column if not exists updatedat timestamptz;

alter table public.team_members add column if not exists rolekey text;
alter table public.team_members add column if not exists photo text;
alter table public.team_members add column if not exists updatedat timestamptz;

alter table public.gallery_images add column if not exists src text;
alter table public.gallery_images add column if not exists altkey text;
alter table public.gallery_images add column if not exists updatedat timestamptz;

alter table public.impact_stats add column if not exists suffix text;
alter table public.impact_stats add column if not exists labelkey text;
alter table public.impact_stats add column if not exists updatedat timestamptz;

alter table public.testimonials add column if not exists quotekey text;
alter table public.testimonials add column if not exists attribution text;
alter table public.testimonials add column if not exists rolekey text;
alter table public.testimonials add column if not exists updatedat timestamptz;

alter table public.contacts add column if not exists updatedat timestamptz;
alter table public.volunteers add column if not exists updatedat timestamptz;

-- Only the backend (service role) reads/writes these tables.
alter table public.admins enable row level security;
alter table public.programs enable row level security;
alter table public.events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_images enable row level security;
alter table public.impact_stats enable row level security;
alter table public.testimonials enable row level security;
alter table public.contacts enable row level security;
alter table public.volunteers enable row level security;
