import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Building2, Globe, Check, LogOut } from 'lucide-react'
import { loadSettings, saveSettings, type ClinicSettings } from '@/lib/settings'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export function Settings() {
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<ClinicSettings>(loadSettings)
  const [saved, setSaved] = useState(false)

  const set = (k: keyof ClinicSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSave = () => {
    saveSettings(form)
    // apply language if changed
    if (form.defaultLanguage !== i18n.language) {
      i18n.changeLanguage(form.defaultLanguage)
      document.documentElement.dir = form.defaultLanguage === 'he' ? 'rtl' : 'ltr'
      document.documentElement.lang = form.defaultLanguage
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">{t('settings.title')}</h1>

      <div className="space-y-5">
        {/* Clinic details */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-[#1D9E75]" />
            <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide">{t('settings.clinic')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="שם הקליניקה">
                <input className={inputCls} value={form.clinicName} onChange={set('clinicName')} />
              </Field>
            </div>
            <Field label="טלפון">
              <input type="tel" className={inputCls} value={form.clinicPhone} onChange={set('clinicPhone')} />
            </Field>
            <Field label="אימייל">
              <input type="email" className={inputCls} value={form.clinicEmail} onChange={set('clinicEmail')} />
            </Field>
            <div className="col-span-2">
              <Field label="כתובת">
                <input className={inputCls} value={form.clinicAddress} onChange={set('clinicAddress')} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="אתר">
                <input type="url" className={inputCls} value={form.clinicWebsite} onChange={set('clinicWebsite')} placeholder="https://..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="שם המטפלת הראשית">
                <input className={inputCls} value={form.therapistName} onChange={set('therapistName')} />
              </Field>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-[#1D9E75]" />
            <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide">{t('settings.language')}</h2>
          </div>
          <div className="flex gap-3">
            {(['he', 'en'] as const).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, defaultLanguage: lang }))}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  form.defaultLanguage === lang
                    ? 'text-white border-[#1D9E75]'
                    : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
                }`}
                style={form.defaultLanguage === lang ? { background: '#1D9E75' } : {}}
              >
                {lang === 'he' ? '🇮🇱 עברית' : '🇺🇸 English'}
              </button>
            ))}
          </div>
        </section>

        {/* App info */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">אודות האפליקציה</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">שם</span>
              <span className="font-medium text-slate-800">HYDRA Clinic Manager</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">גרסה</span>
              <span className="font-medium text-slate-800">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">מסד נתונים</span>
              <span className="font-medium text-green-600">✓ Supabase מחובר</span>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="space-y-3 pb-4">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#1D9E75' }}
          >
            {saved ? (
              <>
                <Check size={17} />
                נשמר בהצלחה!
              </>
            ) : (
              'שמירת הגדרות'
            )}
          </button>

          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 py-3.5 rounded-xl border border-red-200 hover:bg-red-50 transition-all"
          >
            <LogOut size={17} />
            התנתקות
          </button>
        </div>
      </div>
    </div>
  )
}
