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

create table if not exists public.employees (
  id text primary key,
  name text,
  role text,
  department text,
  phone text,
  email text,
  startdate text,
  salary numeric,
  bankname text,
  bankaccount text,
  taxid text,
  active boolean default true,
  username text,
  passwordhash text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.attendance (
  id text primary key,
  employeeid text,
  date text,
  checkin text,
  checkout text,
  status text,
  latitude text,
  longitude text,
  locationlabel text,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.tokens (
  id text primary key,
  date text,
  token text,
  active boolean default true,
  createdat timestamptz,
  updatedat timestamptz
);

create table if not exists public.leave_requests (
  id text primary key,
  employeeid text,
  startdate text,
  enddate text,
  type text,
  reason text,
  status text,
  adminnote text,
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

alter table public.employees add column if not exists role text;
alter table public.employees add column if not exists department text;
alter table public.employees add column if not exists phone text;
alter table public.employees add column if not exists email text;
alter table public.employees add column if not exists startdate text;
alter table public.employees add column if not exists salary numeric;
alter table public.employees add column if not exists bankname text;
alter table public.employees add column if not exists bankaccount text;
alter table public.employees add column if not exists taxid text;
alter table public.employees add column if not exists active boolean default true;
alter table public.employees add column if not exists username text;
alter table public.employees add column if not exists passwordhash text;
alter table public.employees add column if not exists updatedat timestamptz;

alter table public.attendance add column if not exists employeeid text;
alter table public.attendance add column if not exists date text;
alter table public.attendance add column if not exists checkin text;
alter table public.attendance add column if not exists checkout text;
alter table public.attendance add column if not exists status text;
alter table public.attendance add column if not exists latitude text;
alter table public.attendance add column if not exists longitude text;
alter table public.attendance add column if not exists locationlabel text;
alter table public.attendance add column if not exists updatedat timestamptz;

alter table public.leave_requests add column if not exists employeeid text;
alter table public.leave_requests add column if not exists startdate text;
alter table public.leave_requests add column if not exists enddate text;
alter table public.leave_requests add column if not exists type text;
alter table public.leave_requests add column if not exists reason text;
alter table public.leave_requests add column if not exists status text;
alter table public.leave_requests add column if not exists adminnote text;
alter table public.leave_requests add column if not exists updatedat timestamptz;

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
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
alter table public.leave_requests enable row level security;
alter table public.tokens enable row level security;
