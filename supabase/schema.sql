-- ============================================================
-- CLINORA — Supabase PostgreSQL Schema
-- Run this entire file once in your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Paste -> Run)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables (clean slate on re-run)
drop table if exists reports         cascade;
drop table if exists appointments    cascade;
drop table if exists cases           cascade;
drop table if exists availability    cascade;
drop table if exists doctor_profiles cascade;
drop table if exists specializations cascade;
drop table if exists profiles        cascade;

-- ── 1. profiles (extends auth.users) ─────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text        not null,
  email       text        not null unique,
  role        text        not null check (role in ('patient','doctor','admin')),
  is_active   boolean     not null default true,
  is_approved boolean     not null default true,
  created_at  timestamptz not null default now()
);
alter table profiles enable row level security;

-- ── 2. specializations ───────────────────────────────────────
create table specializations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text not null default 'Medical clinical department'
);
alter table specializations enable row level security;

-- ── 3. doctor_profiles ───────────────────────────────────────
create table doctor_profiles (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null unique references profiles(id) on delete cascade,
  specialization   text not null default 'General Medicine',
  bio              text not null default 'Practicing physician at CLINORA.',
  experience_years int  not null default 1,
  consultation_fee int  not null default 500
);
alter table doctor_profiles enable row level security;

-- ── 4. availability ──────────────────────────────────────────
create table availability (
  id          uuid primary key default uuid_generate_v4(),
  doctor_id   uuid not null references profiles(id) on delete cascade,
  day_of_week text not null check (day_of_week in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  start_time  time not null,
  end_time    time not null,
  constraint availability_unique_day unique (doctor_id, day_of_week),
  constraint valid_time_range check (start_time < end_time)
);
alter table availability enable row level security;

-- ── 5. cases ─────────────────────────────────────────────────
create table cases (
  id                   uuid primary key default uuid_generate_v4(),
  patient_id           uuid not null references profiles(id) on delete cascade,
  patient_name         text not null,
  chief_complaint      text not null,
  duration_of_symptoms text not null default '',
  joint_assessment     text not null default '',
  past_history         text not null default 'None reported',
  drug_allergy_history text not null default 'No known drug allergies (NKDA)',
  family_history       text not null default 'Non-contributory',
  attachment_urls      text[] not null default '{}',
  created_at           timestamptz not null default now()
);
alter table cases enable row level security;

-- ── 6. appointments ──────────────────────────────────────────
create table appointments (
  id               uuid primary key default uuid_generate_v4(),
  patient_id       uuid not null references profiles(id) on delete cascade,
  patient_name     text not null,
  doctor_id        uuid not null references profiles(id) on delete cascade,
  doctor_name      text not null,
  specialization   text not null default 'General Medicine',
  case_id          uuid references cases(id) on delete set null,
  date             date not null,
  time_slot        text not null,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','completed','cancelled','no_show')),
  payment_method   text not null default 'pay_at_reception'
                     check (payment_method in ('online','pay_at_reception')),
  payment_status   text not null default 'pending'
                     check (payment_status in ('paid','pending')),
  notes            text not null default '',
  updated_at       timestamptz,
  created_at       timestamptz not null default now()
);
alter table appointments enable row level security;

-- Prevent double-booking: one active appointment per doctor/date/slot
create unique index appointments_no_double_book
  on appointments (doctor_id, date, time_slot)
  where status in ('pending','confirmed');

-- ── 7. reports ───────────────────────────────────────────────
create table reports (
  id            uuid primary key default uuid_generate_v4(),
  reporter_id   uuid not null references profiles(id) on delete cascade,
  reporter_name text not null,
  reporter_role text not null,
  description   text not null,
  status        text not null default 'open' check (status in ('open','resolved')),
  created_at    timestamptz not null default now()
);
alter table reports enable row level security;

-- ════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ════════════════════════════════════════════════════════════
create or replace function is_admin()
returns boolean
language sql stable security definer
as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin')
$$;

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — profiles
-- ════════════════════════════════════════════════════════════
create policy "profiles_select_all"    on profiles for select using (true);
create policy "profiles_insert_any"    on profiles for insert with check (true);
create policy "profiles_update_any"    on profiles for update using (true);

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — specializations
-- ════════════════════════════════════════════════════════════
create policy "spec_select_all"    on specializations for select using (true);
create policy "spec_insert_admin"  on specializations for insert with check (is_admin());
create policy "spec_delete_admin"  on specializations for delete using (is_admin());

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — doctor_profiles
-- ════════════════════════════════════════════════════════════
create policy "dp_select_all"       on doctor_profiles for select using (true);
create policy "dp_insert_any"       on doctor_profiles for insert with check (true);
create policy "dp_update_own"       on doctor_profiles for update using (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — availability
-- ════════════════════════════════════════════════════════════
create policy "avail_select_all"   on availability for select using (true);
create policy "avail_insert_any"   on availability for insert with check (true);
create policy "avail_update_own"   on availability for update using (auth.uid() = doctor_id);
create policy "avail_delete_own"   on availability for delete using (auth.uid() = doctor_id);

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — cases
-- ════════════════════════════════════════════════════════════
create policy "cases_select" on cases for select using (
  auth.uid() = patient_id
  or is_admin()
  or exists (select 1 from appointments a where a.case_id = cases.id and a.doctor_id = auth.uid())
);
create policy "cases_insert" on cases for insert with check (auth.uid() = patient_id);
create policy "cases_update" on cases for update using (auth.uid() = patient_id);

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — appointments
-- ════════════════════════════════════════════════════════════
create policy "appt_select" on appointments for select using (
  auth.uid() = patient_id or auth.uid() = doctor_id or is_admin()
);
create policy "appt_insert" on appointments for insert with check (auth.uid() = patient_id);
create policy "appt_update" on appointments for update using (
  auth.uid() = doctor_id or auth.uid() = patient_id or is_admin()
);

-- ════════════════════════════════════════════════════════════
-- RLS POLICIES — reports
-- ════════════════════════════════════════════════════════════
create policy "rep_select" on reports for select using (auth.uid() = reporter_id or is_admin());
create policy "rep_insert" on reports for insert with check (auth.uid() = reporter_id);
create policy "rep_update" on reports for update using (is_admin());

-- ════════════════════════════════════════════════════════════
-- TRIGGER: auto-create profile row on Supabase Auth signup
-- ════════════════════════════════════════════════════════════
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, name, email, role, is_active, is_approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role','patient'),
    true,
    case when coalesce(new.raw_user_meta_data->>'role','patient') = 'doctor' then false else true end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ════════════════════════════════════════════════════════════
-- SEED — Specializations
-- ════════════════════════════════════════════════════════════
insert into specializations (name, description) values
  ('Cardiology',       'Heart, blood vessels, coronary wellness, and hypertension management'),
  ('Pediatrics',       'Newborn care, child development, and adolescent health'),
  ('Dermatology',      'Skin conditions, eczema, acne therapy, and preventive screening'),
  ('Orthopedics',      'Bones, joints, sports injuries, and musculoskeletal care'),
  ('Neurology',        'Brain, spine, peripheral nerves, and chronic headaches'),
  ('General Medicine', 'Primary care, preventive medicine, and general consultations')
on conflict (name) do nothing;
