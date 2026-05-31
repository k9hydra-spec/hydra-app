import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createClient } from '@/lib/api'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-400 ms-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BB8C5]/30 focus:border-[#5BB8C5]'

export function NewClient() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    pet_name: '',
    pet_breed: '',
    pet_dob: '',
    pet_sex: '',
    pet_neutered: false,
    pet_weight: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_address: '',
    vet_name: '',
    referrer: '',
    insurance_company: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({
      ...prev,
      [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pet_name.trim() || !form.owner_name.trim()) {
      setError('שם בעל החיים ושם הבעלים הם שדות חובה')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const client = await createClient({
        pet_name: form.pet_name.trim(),
        pet_breed: form.pet_breed || undefined,
        pet_dob: form.pet_dob || undefined,
        pet_sex: form.pet_sex || undefined,
        pet_neutered: form.pet_neutered,
        pet_weight: form.pet_weight ? Number(form.pet_weight) : undefined,
        owner_name: form.owner_name.trim(),
        owner_phone: form.owner_phone || undefined,
        owner_email: form.owner_email || undefined,
        owner_address: form.owner_address || undefined,
        vet_name: form.vet_name || undefined,
        referrer: form.referrer || undefined,
        insurance_company: form.insurance_company || undefined,
        is_active: true,
      })
      navigate(`/clients/${client.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">{t('newClient.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#5BB8C5] uppercase tracking-wide mb-4">פרטי בעל החיים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="שם בעל החיים" required>
                <input className={inputCls} value={form.pet_name} onChange={set('pet_name')} />
              </Field>
            </div>
            <Field label="גזע">
              <input className={inputCls} value={form.pet_breed} onChange={set('pet_breed')} />
            </Field>
            <Field label="תאריך לידה">
              <input type="date" className={inputCls} value={form.pet_dob} onChange={set('pet_dob')} />
            </Field>
            <Field label="מין">
              <select className={inputCls} value={form.pet_sex} onChange={set('pet_sex')}>
                <option value="">בחר...</option>
                <option value="זכר">זכר</option>
                <option value="נקבה">נקבה</option>
              </select>
            </Field>
            <Field label='משקל (ק"ג)'>
              <input type="number" step="0.1" className={inputCls} value={form.pet_weight} onChange={set('pet_weight')} />
            </Field>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="neutered"
                checked={form.pet_neutered}
                onChange={set('pet_neutered')}
                className="w-4 h-4 accent-[#5BB8C5]"
              />
              <label htmlFor="neutered" className="text-sm text-slate-700">מעוקר / מסורסת</label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#5BB8C5] uppercase tracking-wide mb-4">פרטי הבעלים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="שם הבעלים" required>
                <input className={inputCls} value={form.owner_name} onChange={set('owner_name')} />
              </Field>
            </div>
            <Field label="טלפון">
              <input type="tel" className={inputCls} value={form.owner_phone} onChange={set('owner_phone')} />
            </Field>
            <Field label="אימייל">
              <input type="email" className={inputCls} value={form.owner_email} onChange={set('owner_email')} />
            </Field>
            <div className="col-span-2">
              <Field label="כתובת">
                <input className={inputCls} value={form.owner_address} onChange={set('owner_address')} />
              </Field>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#5BB8C5] uppercase tracking-wide mb-4">מידע רפואי</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="וטרינר מטפל">
              <input className={inputCls} value={form.vet_name} onChange={set('vet_name')} />
            </Field>
            <Field label="גורם מפנה">
              <input className={inputCls} value={form.referrer} onChange={set('referrer')} />
            </Field>
            <div className="col-span-2">
              <Field label="חברת ביטוח">
                <input className={inputCls} value={form.insurance_company} onChange={set('insurance_company')} />
              </Field>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 text-sm font-medium text-white py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-60"
            style={{ background: '#5BB8C5' }}
          >
            {saving ? 'שומר...' : t('newClient.save')}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 text-sm font-medium text-slate-600 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {t('newClient.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
