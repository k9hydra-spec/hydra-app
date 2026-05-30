export type ClinicSettings = {
  clinicName: string
  clinicPhone: string
  clinicAddress: string
  clinicEmail: string
  clinicWebsite: string
  therapistName: string
  defaultLanguage: 'he' | 'en'
}

const KEY = 'hydra_clinic_settings'

const DEFAULTS: ClinicSettings = {
  clinicName: 'HYDRA',
  clinicPhone: '',
  clinicAddress: '',
  clinicEmail: '',
  clinicWebsite: '',
  therapistName: '',
  defaultLanguage: 'he',
}

export function loadSettings(): ClinicSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULTS }
}

export function saveSettings(s: ClinicSettings): void {
  localStorage.setItem(KEY, JSON.stringify(s))
}
