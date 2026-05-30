import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Client = {
  id: string
  pet_name: string
  pet_breed?: string
  pet_dob?: string
  pet_sex?: string
  pet_neutered?: boolean
  pet_weight?: number
  owner_name: string
  owner_phone?: string
  owner_email?: string
  owner_address?: string
  vet_name?: string
  referrer?: string
  insurance_company?: string
  created_at: string
  is_active: boolean
}

export type Assessment = {
  id: string
  client_id: string
  date: string
  reason?: string
  chief_complaint?: string
  complaint_start?: string
  affected_limb?: string
  complaint_progress?: string
  activity_restriction?: string
  owner_description?: string
  existing_diagnosis?: boolean
  diagnosis_details?: string
  had_surgery?: boolean
  surgery_type?: string
  surgery_date?: string
  surgeon_vet?: string
  pain_meds?: string
  other_meds?: string
  imaging?: string
  previous_treatments?: string
  touch_sensitivity?: boolean
  housing_type?: string
  slippery_floor?: boolean
  other_pets?: string
  walks_per_day?: number
  walk_duration?: string
  activity_type?: string
  difficulty_rising?: boolean
  difficulty_stairs?: boolean
  car_access?: string
  furniture_access?: string
  diet?: string
  supplements?: string
  accessories?: string
  gait_pattern?: string
  pain_score?: number
  bcs_score?: number
  crepitus?: boolean
  crepitus_limb?: string
  crepitus_grade?: number
  compensations?: boolean
  compensation_details?: string
  limb_assessment?: Record<string, unknown>
  exam_notes?: string
  treatment_plan?: string
  series_count?: number
  therapist_name?: string
}

export type Treatment = {
  id: string
  client_id: string
  date: string
  treatment_number?: number
  treatment_type?: string
  in_series?: boolean
  series_number?: number
  series_total?: number
  client_report?: string
  eswt_performed?: boolean
  eswt_source?: string
  eswt_pad?: string
  eswt_intensity?: string
  eswt_pulses?: number
  eswt_areas?: string[]
  laser_performed?: boolean
  laser_areas?: string[]
  ultrasound_performed?: boolean
  prom_performed?: boolean
  prom_limbs?: string[]
  active_exercises?: Record<string, unknown>
  additional_treatments?: string[]
  treadmill_speed?: string
  treadmill_water_height?: number
  treadmill_segments?: number[]
  hydro_equipment?: string[]
  therapist_notes?: string
  progress?: string
  recommendations?: string
  therapist_name?: string
}

export type DailySchedule = {
  id: string
  date: string
  client_id: string
  arrival_time?: string
  treatment_type?: string
  notes?: string
  order_index?: number
}
