-- HYDRA Clinic Management App — Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =====================
-- TABLE: clients
-- =====================
create table clients (
  id uuid primary key default gen_random_uuid(),
  pet_name text not null,
  pet_breed text,
  pet_dob date,
  pet_sex text,
  pet_neutered boolean,
  pet_weight numeric,
  owner_name text not null,
  owner_phone text,
  owner_email text,
  owner_address text,
  vet_name text,
  referrer text,
  insurance_company text,
  created_at timestamptz default now(),
  is_active boolean default true
);

-- =====================
-- TABLE: assessments
-- =====================
create table assessments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  date date not null,
  reason text,
  chief_complaint text,
  complaint_start text,
  affected_limb text,
  complaint_progress text,
  activity_restriction text,
  owner_description text,
  existing_diagnosis boolean,
  diagnosis_details text,
  had_surgery boolean,
  surgery_type text,
  surgery_date date,
  surgeon_vet text,
  pain_meds text,
  other_meds text,
  imaging text,
  previous_treatments text,
  touch_sensitivity boolean,
  housing_type text,
  slippery_floor boolean,
  other_pets text,
  walks_per_day integer,
  walk_duration text,
  activity_type text,
  difficulty_rising boolean,
  difficulty_stairs boolean,
  car_access text,
  furniture_access text,
  diet text,
  supplements text,
  accessories text,
  gait_pattern text,
  pain_score integer,
  bcs_score integer,
  crepitus boolean,
  crepitus_limb text,
  crepitus_grade integer,
  compensations boolean,
  compensation_details text,
  limb_assessment jsonb,
  exam_notes text,
  treatment_plan text,
  series_count integer,
  therapist_name text,
  created_at timestamptz default now()
);

-- =====================
-- TABLE: treatments
-- =====================
create table treatments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  date date not null,
  treatment_number integer,
  treatment_type text,
  in_series boolean,
  series_number integer,
  series_total integer,
  client_report text,
  eswt_performed boolean,
  eswt_source text,
  eswt_pad text,
  eswt_intensity text,
  eswt_pulses integer,
  eswt_areas text[],
  laser_performed boolean,
  laser_areas text[],
  ultrasound_performed boolean,
  prom_performed boolean,
  prom_limbs text[],
  active_exercises jsonb,
  additional_treatments text[],
  treadmill_speed text,
  treadmill_water_height integer,
  treadmill_segments integer[],
  hydro_equipment text[],
  therapist_notes text,
  progress text,
  recommendations text,
  therapist_name text,
  created_at timestamptz default now()
);

-- =====================
-- TABLE: daily_schedule
-- =====================
create table daily_schedule (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  client_id uuid references clients(id) on delete cascade,
  arrival_time text,
  treatment_type text,
  notes text,
  order_index integer,
  created_at timestamptz default now()
);

-- =====================
-- RLS Policies
-- =====================
alter table clients enable row level security;
alter table assessments enable row level security;
alter table treatments enable row level security;
alter table daily_schedule enable row level security;

-- Allow authenticated users to read/write all data (single-tenant clinic)
create policy "Authenticated users full access" on clients
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on assessments
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on treatments
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on daily_schedule
  for all using (auth.role() = 'authenticated');

-- =====================
-- Indexes
-- =====================
create index on clients(owner_name);
create index on clients(pet_name);
create index on assessments(client_id);
create index on treatments(client_id);
create index on treatments(date);
create index on daily_schedule(date);
