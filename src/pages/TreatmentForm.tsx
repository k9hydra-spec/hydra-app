import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { createTreatment, getTreatments, getClient } from '@/lib/api'
import type { Client } from '@/lib/supabase'

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'
const textareaCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] resize-none'

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">{children}</h2>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
        checked ? 'text-white border-[#1D9E75]' : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
      )}
      style={checked ? { background: '#1D9E75' } : {}}
    >
      {label}
    </button>
  )
}

const TREATMENT_TYPES = [
  'פגישת ייעוץ (שעה)',
  'טיפול משולב פיזיו+הידרו',
  'פיזיותרפיה (30 דק׳)',
  'הידרותרפיה (30 דק׳)',
  'לייזר/שוקוויב (30 דק׳)',
  'התאמת עזרים (שעה)',
]

const ESWT_AREAS = [
  'Lumbar', 'Thoracic', 'Cervical',
  'L lateral hip', 'R lateral hip', 'Bi lateral hip',
  'L lateral stifle', 'R lateral stifle', 'Bi lateral stifle',
  'L lateral elbow', 'R lateral elbow', 'Bi lateral elbow',
  'L lateral shoulder', 'R lateral shoulder', 'Bi lateral shoulder',
  'L lateral carpus', 'R lateral carpus', 'Bi lateral carpus',
  'L tarsus', 'R tarsus', 'OTHER',
]

const HYDRO_EQUIPMENT = [
  'ווסט למים', 'מסגרת', 'משקולת קדמי', 'משקולת אחורי',
  'Hands on', 'רצועת התנגדות', 'No knuckle', 'Ear band', 'רתמה',
]

const HYDRO_EXERCISES = [
  'Down to stand', 'Sit to stand', 'Weight shift', 'Orbit+donut',
  'Elevated front', 'Cavalleti', 'Infinity', 'Obstacle course',
  'Over and back', 'Wobble board', 'Cookie stretch', 'Stretch',
  'Land treadmill', '3 leg stance', 'Give paw', 'B.disc front',
  'Massage', 'B.disc all 4', 'B.disc back', 'Side stepping',
]

const ADDITIONAL_TREATMENTS = ['TENS', 'EMS', 'דיקור', 'הליכון יבש', 'מסאז׳']

type Exercise = { name: string; reps: string; sets: string }

function MultiSelect({ options, selected, onChange }: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            'px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors',
            selected.includes(opt)
              ? 'text-white border-[#1D9E75]'
              : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
          )}
          style={selected.includes(opt) ? { background: '#1D9E75' } : {}}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function TreatmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const BackIcon = isHe ? ChevronRight : ChevronLeft

  const [client, setClient] = useState<Client | null>(null)
  const [nextNumber, setNextNumber] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([getClient(id), getTreatments(id)]).then(([c, ts]) => {
      setClient(c)
      setNextNumber(ts.length + 1)
    })
  }, [id])

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    treatment_type: '',
    in_series: false,
    series_number: '',
    series_total: '',
    client_report: '',
    // ESWT
    eswt_performed: false,
    eswt_source: '',
    eswt_pad: '',
    eswt_intensity: '',
    eswt_pulses: '',
    // Laser
    laser_performed: false,
    // Ultrasound
    ultrasound_performed: false,
    // PROM
    prom_performed: false,
    // Treadmill
    treadmill_speed: '',
    treadmill_water_height: '',
    // Notes
    therapist_notes: '',
    progress: '',
    recommendations: '',
    therapist_name: '',
  })

  const [eswtAreas, setEswtAreas] = useState<string[]>([])
  const [laserAreas, setLaserAreas] = useState<string[]>([])
  const [promLimbs, setPromLimbs] = useState<string[]>([])
  const [hydroEquipment, setHydroEquipment] = useState<string[]>([])
  const [additionalTreatments, setAdditionalTreatments] = useState<string[]>([])
  const [treadmillSegments, setTreadmillSegments] = useState<string[]>([''])
  const [exercises, setExercises] = useState<Exercise[]>([])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({
      ...prev,
      [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
    }))

  const setVal = (k: keyof typeof form) => (v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const addExercise = (name: string) => {
    if (!exercises.find(e => e.name === name))
      setExercises(prev => [...prev, { name, reps: '', sets: '' }])
  }

  const removeExercise = (name: string) =>
    setExercises(prev => prev.filter(e => e.name !== name))

  const updateExercise = (name: string, field: 'reps' | 'sets', value: string) =>
    setExercises(prev => prev.map(e => e.name === name ? { ...e, [field]: value } : e))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)
    try {
      await createTreatment({
        client_id: id,
        date: form.date,
        treatment_number: nextNumber,
        treatment_type: form.treatment_type || undefined,
        in_series: form.in_series,
        series_number: form.series_number ? Number(form.series_number) : undefined,
        series_total: form.series_total ? Number(form.series_total) : undefined,
        client_report: form.client_report || undefined,
        eswt_performed: form.eswt_performed,
        eswt_source: form.eswt_source || undefined,
        eswt_pad: form.eswt_pad || undefined,
        eswt_intensity: form.eswt_intensity || undefined,
        eswt_pulses: form.eswt_pulses ? Number(form.eswt_pulses) : undefined,
        eswt_areas: eswtAreas.length ? eswtAreas : undefined,
        laser_performed: form.laser_performed,
        laser_areas: laserAreas.length ? laserAreas : undefined,
        ultrasound_performed: form.ultrasound_performed,
        prom_performed: form.prom_performed,
        prom_limbs: promLimbs.length ? promLimbs : undefined,
        active_exercises: exercises.length ? (exercises as unknown as Record<string, unknown>) : undefined,
        additional_treatments: additionalTreatments.length ? additionalTreatments : undefined,
        treadmill_speed: form.treadmill_speed || undefined,
        treadmill_water_height: form.treadmill_water_height ? Number(form.treadmill_water_height) : undefined,
        treadmill_segments: treadmillSegments.filter(Boolean).map(Number),
        hydro_equipment: hydroEquipment.length ? hydroEquipment : undefined,
        therapist_notes: form.therapist_notes || undefined,
        progress: form.progress || undefined,
        recommendations: form.recommendations || undefined,
        therapist_name: form.therapist_name || undefined,
      })
      navigate(`/clients/${id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <BackIcon size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">תיעוד טיפול</h1>
          {client && <p className="text-xs text-slate-500">{client.pet_name} · {client.owner_name}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section 1: Treatment details */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>פרטי הטיפול</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="תאריך">
                <input type="date" className={inputCls} value={form.date} onChange={set('date')} />
              </Field>
              <Field label="מספר טיפול">
                <input type="number" className={cn(inputCls, 'bg-slate-50')} value={nextNumber} readOnly />
              </Field>
            </div>
            <Field label="סוג טיפול">
              <select className={inputCls} value={form.treatment_type} onChange={set('treatment_type')}>
                <option value="">בחר...</option>
                {TREATMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="in_series"
                checked={form.in_series}
                onChange={e => setVal('in_series')(e.target.checked)}
                className="w-4 h-4 accent-[#1D9E75]"
              />
              <label htmlFor="in_series" className="text-sm text-slate-700">חלק מסדרה</label>
            </div>
            {form.in_series && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="מספר בסדרה">
                  <input type="number" className={inputCls} value={form.series_number} onChange={set('series_number')} />
                </Field>
                <Field label='סה"כ בסדרה'>
                  <input type="number" className={inputCls} value={form.series_total} onChange={set('series_total')} />
                </Field>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Client report */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>דיווח הלקוח</SectionTitle>
          <textarea
            className={textareaCls}
            rows={3}
            placeholder="איך הכלב הרגיש מאז הטיפול האחרון?"
            value={form.client_report}
            onChange={set('client_report')}
          />
        </section>

        {/* Section 3: Physio room */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>חדר פיזיו</SectionTitle>
          <div className="space-y-5">

            {/* ESWT */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Toggle label="שוקוויב (ESWT)" checked={form.eswt_performed} onChange={v => setVal('eswt_performed')(v)} />
              </div>
              {form.eswt_performed && (
                <div className="ps-4 border-s-2 border-[#1D9E75]/30 space-y-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Piezowave2 ESWT</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Therapy source">
                      <select className={inputCls} value={form.eswt_source} onChange={set('eswt_source')}>
                        <option value="">בחר...</option>
                        <option>Radial</option>
                        <option>Focused</option>
                      </select>
                    </Field>
                    <Field label="Pad">
                      <input className={inputCls} value={form.eswt_pad} onChange={set('eswt_pad')} />
                    </Field>
                    <Field label="Intensity">
                      <input className={inputCls} value={form.eswt_intensity} onChange={set('eswt_intensity')} />
                    </Field>
                    <Field label="Pulses">
                      <input type="number" className={inputCls} value={form.eswt_pulses} onChange={set('eswt_pulses')} />
                    </Field>
                  </div>
                  <Field label="אזורי טיפול">
                    <MultiSelect options={ESWT_AREAS} selected={eswtAreas} onChange={setEswtAreas} />
                  </Field>
                </div>
              )}
            </div>

            {/* Laser */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Toggle label="לייזר" checked={form.laser_performed} onChange={v => setVal('laser_performed')(v)} />
              </div>
              {form.laser_performed && (
                <div className="ps-4 border-s-2 border-[#1D9E75]/30">
                  <Field label="אזורי טיפול">
                    <MultiSelect options={ESWT_AREAS} selected={laserAreas} onChange={setLaserAreas} />
                  </Field>
                </div>
              )}
            </div>

            {/* Ultrasound */}
            <Toggle label="אולטרסאונד" checked={form.ultrasound_performed} onChange={v => setVal('ultrasound_performed')(v)} />

            {/* PROM */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Toggle label="PROM" checked={form.prom_performed} onChange={v => setVal('prom_performed')(v)} />
              </div>
              {form.prom_performed && (
                <div className="ps-4 border-s-2 border-[#1D9E75]/30">
                  <Field label="גפיים">
                    <MultiSelect
                      options={['FL (קדמי ימני)', 'FR (קדמי שמאלי)', 'HL (אחורי ימני)', 'HR (אחורי שמאלי)']}
                      selected={promLimbs}
                      onChange={setPromLimbs}
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* Active exercises */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">תרגילים אקטיביים</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {HYDRO_EXERCISES.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => exercises.find(e => e.name === ex) ? removeExercise(ex) : addExercise(ex)}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                      exercises.find(e => e.name === ex)
                        ? 'text-white border-[#1D9E75]'
                        : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
                    )}
                    style={exercises.find(e => e.name === ex) ? { background: '#1D9E75' } : {}}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              {exercises.length > 0 && (
                <div className="space-y-2 mt-2">
                  {exercises.map(ex => (
                    <div key={ex.name} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm flex-1 font-medium text-slate-700">{ex.name}</span>
                      <input
                        type="number"
                        placeholder="חזרות"
                        value={ex.reps}
                        onChange={e => updateExercise(ex.name, 'reps', e.target.value)}
                        className="w-20 border border-slate-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-[#1D9E75]"
                      />
                      <span className="text-xs text-slate-400">×</span>
                      <input
                        type="number"
                        placeholder="סטים"
                        value={ex.sets}
                        onChange={e => updateExercise(ex.name, 'sets', e.target.value)}
                        className="w-20 border border-slate-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-[#1D9E75]"
                      />
                      <button type="button" onClick={() => removeExercise(ex.name)} className="text-slate-300 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional treatments */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">טיפולים נוספים</p>
              <MultiSelect options={ADDITIONAL_TREATMENTS} selected={additionalTreatments} onChange={setAdditionalTreatments} />
            </div>
          </div>
        </section>

        {/* Section 4: Hydro room */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>חדר הידרו — הליכון מים</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="מהירות">
                <input className={inputCls} value={form.treadmill_speed} onChange={set('treadmill_speed')} placeholder="1.5 km/h" />
              </Field>
              <Field label="גובה מים (cm)">
                <input type="number" className={inputCls} value={form.treadmill_water_height} onChange={set('treadmill_water_height')} />
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">קטעי הליכה (דקות)</label>
              <div className="flex flex-wrap gap-2 items-center">
                {treadmillSegments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      type="number"
                      value={seg}
                      onChange={e => setTreadmillSegments(prev => prev.map((s, j) => j === i ? e.target.value : s))}
                      className="w-16 border border-slate-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-[#1D9E75]"
                      placeholder="דק׳"
                    />
                    {treadmillSegments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTreadmillSegments(prev => prev.filter((_, j) => j !== i))}
                        className="text-slate-300 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setTreadmillSegments(prev => [...prev, ''])}
                  className="flex items-center gap-1 text-xs text-[#1D9E75] hover:underline"
                >
                  <Plus size={13} /> הוסף קטע
                </button>
              </div>
            </div>

            <Field label="אביזרים">
              <MultiSelect options={HYDRO_EQUIPMENT} selected={hydroEquipment} onChange={setHydroEquipment} />
            </Field>
          </div>
        </section>

        {/* Section 5: Summary */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>התבוננות וסיכום</SectionTitle>
          <div className="space-y-4">
            <Field label="התבוננות המטפלת">
              <textarea className={textareaCls} rows={3} value={form.therapist_notes} onChange={set('therapist_notes')} />
            </Field>
            <Field label="התקדמות">
              <textarea className={textareaCls} rows={2} value={form.progress} onChange={set('progress')} />
            </Field>
            <Field label="המלצות לטיפול הבא">
              <textarea className={textareaCls} rows={2} value={form.recommendations} onChange={set('recommendations')} />
            </Field>
            <Field label="שם המטפלת">
              <input className={inputCls} value={form.therapist_name} onChange={set('therapist_name')} />
            </Field>
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
            style={{ background: '#1D9E75' }}
          >
            {saving ? 'שומר...' : 'שמירת טיפול'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 text-sm font-medium text-slate-600 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  )
}
