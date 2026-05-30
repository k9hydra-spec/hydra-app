import { supabase } from './supabase'
import type { Client, Assessment, Treatment, DailySchedule } from './supabase'

// Clients
export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('is_active', true)
    .order('pet_name')
  if (error) throw error
  return data ?? []
}

export async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<void> {
  const { error } = await supabase.from('clients').update(updates).eq('id', id)
  if (error) throw error
}

// Assessments
export async function getAssessments(clientId: string): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createAssessment(assessment: Omit<Assessment, 'id'>): Promise<Assessment> {
  const { data, error } = await supabase
    .from('assessments')
    .insert(assessment)
    .select()
    .single()
  if (error) throw error
  return data
}

// Treatments
export async function getTreatments(clientId: string): Promise<Treatment[]> {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createTreatment(treatment: Omit<Treatment, 'id'>): Promise<Treatment> {
  const { data, error } = await supabase
    .from('treatments')
    .insert(treatment)
    .select()
    .single()
  if (error) throw error
  return data
}

// Daily schedule
export async function getDailySchedule(date: string): Promise<(DailySchedule & { client: Client })[]> {
  const { data, error } = await supabase
    .from('daily_schedule')
    .select('*, client:clients(*)')
    .eq('date', date)
    .order('order_index')
  if (error) throw error
  return (data ?? []) as (DailySchedule & { client: Client })[]
}

export async function addToDailySchedule(entry: Omit<DailySchedule, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('daily_schedule').insert(entry)
  if (error) throw error
}

export async function removeDailyEntry(id: string): Promise<void> {
  const { error } = await supabase.from('daily_schedule').delete().eq('id', id)
  if (error) throw error
}
