import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { createAssessment } from '@/lib/api'

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'
const textareaCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] resize-none'

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">{children}</h2>
}

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

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#1D9E75]"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  )
}

function ScoreButtons({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            'w-10 h-10 rounded-lg text-sm font-semibold border transition-colors',
            value === n
              ? 'text-white border-[#1D9E75]'
              : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
          )}
          style={value === n ? { background: '#1D9E75' } : {}}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

const LIMBS = ['FL (קדמי ימני)', 'FR (קדמי שמאלי)', 'HL (אחורי ימני)', 'HR (אחורי שמאלי)']

type LimbData = { rom: string; circumference: string; pain: string }

export function AssessmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const BackIcon = isHe ? ChevronRight : ChevronLeft

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    reason: '',
    chief_complaint: '',
    complaint_start: '',
    affected_limb: '',
    complaint_progress: '',
    activity_restriction: '',
    owner_description: '',
    existing_diagnosis: false,
    diagnosis_details: '',
    had_surgery: false,
    surgery_type: '',
    surgery_date: '',
    surgeon_vet: '',
    pain_meds: '',
    other_meds: '',
    imaging: '',
    previous_treatments: '',
    touch_sensitivity: false,
    housing_type: '',
    slippery_floor: false,
    other_pets: '',
    walks_per_day: '',
    walk_duration: '',
    activity_type: '',
    difficulty_rising: false,
    difficulty_stairs: false,
    car_access: '',
    furniture_access: '',
    diet: '',
    supplements: '',
    accessories: '',
    gait_pattern: '',
    pain_score: 0,
    bcs_score: 0,
    crepitus: false,
    crepitus_limb: '',
    crepitus_grade: 0,
    compensations: false,
    compensation_details: '',
    exam_notes: '',
    treatment_plan: '',
    series_count: '',
    therapist_name: '',
  })

  const [limbData, setLimbData] = useState<Record<string, LimbData>>({
    'FL (קדמי ימני)': { rom: '', circumference: '', pain: '' },
    'FR (קדמי שמאלי)': { rom: '', circumference: '', pain: '' },
    'HL (אחורי ימני)': { rom: '', circumference: '', pain: '' },
    'HR (אחורי שמאלי)': { rom: '', circumference: '', pain: '' },
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({
      ...prev,
      [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
    }))

  const setVal = (k: keyof typeof form) => (v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)
    try {
      await createAssessment({
        client_id: id,
        date: form.date,
        reason: form.reason || undefined,
        chief_complaint: form.chief_complaint || undefined,
        complaint_start: form.complaint_start || undefined,
        affected_limb: form.affected_limb || undefined,
        complaint_progress: form.complaint_progress || undefined,
        activity_restriction: form.activity_restriction || undefined,
        owner_description: form.owner_description || undefined,
        existing_diagnosis: form.existing_diagnosis,
        diagnosis_details: form.diagnosis_details || undefined,
        had_surgery: form.had_surgery,
        surgery_type: form.surgery_type || undefined,
        surgery_date: form.surgery_date || undefined,
        surgeon_vet: form.surgeon_vet || undefined,
        pain_meds: form.pain_meds || undefined,
        other_meds: form.other_meds || undefined,
        imaging: form.imaging || undefined,
        previous_treatments: form.previous_treatments || undefined,
        touch_sensitivity: form.touch_sensitivity,
        housing_type: form.housing_type || undefined,
        slippery_floor: form.slippery_floor,
        other_pets: form.other_pets || undefined,
        walks_per_day: form.walks_per_day ? Number(form.walks_per_day) : undefined,
        walk_duration: form.walk_duration || undefined,
        activity_type: form.activity_type || undefined,
        difficulty_rising: form.difficulty_rising,
        difficulty_stairs: form.difficulty_stairs,
        car_access: form.car_access || undefined,
        furniture_access: form.furniture_access || undefined,
        diet: form.diet || undefined,
        supplements: form.supplements || undefined,
        accessories: form.accessories || undefined,
        gait_pattern: form.gait_pattern || undefined,
        pain_score: form.pain_score || undefined,
        bcs_score: form.bcs_score || undefined,
        crepitus: form.crepitus,
        crepitus_limb: form.crepitus_limb || undefined,
        crepitus_grade: form.crepitus_grade || undefined,
        compensations: form.compensations,
        compensation_details: form.compensation_details || undefined,
        limb_assessment: limbData,
        exam_notes: form.exam_notes || undefined,
        treatment_plan: form.treatment_plan || undefined,
        series_count: form.series_count ? Number(form.series_count) : undefined,
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
        <h1 className="text-xl font-bold text-slate-800">טופס אבחון</h1>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Section 1: Pet + Owner */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>תאריך ופרטי ביקור</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="תאריך אבחון" required>
              <input type="date" className={inputCls} value={form.date} onChange={set('date')} />
            </Field>
            <Field label="סיבת הגעה">
              <select className={inputCls} value={form.reason} onChange={set('reason')}>
                <option value="">בחר...</option>
                <option>שמרני</option>
                <option>מניעתי</option>
                <option>לפני ניתוח</option>
                <option>אחרי ניתוח</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Section 2: Chief complaint */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>תלונה עיקרית</SectionTitle>
          <div className="space-y-4">
            <Field label="תלונה עיקרית" required>
              <textarea className={textareaCls} rows={3} value={form.chief_complaint} onChange={set('chief_complaint')} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="מתי התחילה">
                <input className={inputCls} value={form.complaint_start} onChange={set('complaint_start')} placeholder="לפני 3 חודשים..." />
              </Field>
              <Field label="גף מושפע">
                <select className={inputCls} value={form.affected_limb} onChange={set('affected_limb')}>
                  <option value="">בחר...</option>
                  <option>קדמי ימני</option>
                  <option>קדמי שמאלי</option>
                  <option>אחורי ימני</option>
                  <option>אחורי שמאלי</option>
                  <option>דו-צדדי קדמי</option>
                  <option>דו-צדדי אחורי</option>
                  <option>כלל גפיים</option>
                  <option>עמוד שדרה</option>
                </select>
              </Field>
              <Field label="מהלך התלונה">
                <select className={inputCls} value={form.complaint_progress} onChange={set('complaint_progress')}>
                  <option value="">בחר...</option>
                  <option>החמירה</option>
                  <option>יציבה</option>
                  <option>השתפרה</option>
                </select>
              </Field>
              <Field label="איסור פעילות">
                <input className={inputCls} value={form.activity_restriction} onChange={set('activity_restriction')} />
              </Field>
            </div>
            <Field label="פירוט חופשי — בעלים">
              <textarea className={textareaCls} rows={3} value={form.owner_description} onChange={set('owner_description')} />
            </Field>
          </div>
        </section>

        {/* Section 3: Medical history */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>היסטוריה רפואית</SectionTitle>
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <CheckField label="אבחון קיים" checked={form.existing_diagnosis} onChange={v => setVal('existing_diagnosis')(v)} />
              {form.existing_diagnosis && (
                <Field label="פרטי האבחון">
                  <input className={inputCls} value={form.diagnosis_details} onChange={set('diagnosis_details')} />
                </Field>
              )}
              <CheckField label="עבר ניתוח" checked={form.had_surgery} onChange={v => setVal('had_surgery')(v)} />
              {form.had_surgery && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="סוג ניתוח">
                    <input className={inputCls} value={form.surgery_type} onChange={set('surgery_type')} />
                  </Field>
                  <Field label="תאריך ניתוח">
                    <input type="date" className={inputCls} value={form.surgery_date} onChange={set('surgery_date')} />
                  </Field>
                  <div className="col-span-2">
                    <Field label="וטרינר מנתח">
                      <input className={inputCls} value={form.surgeon_vet} onChange={set('surgeon_vet')} />
                    </Field>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="שיכוך כאבים">
                <input className={inputCls} value={form.pain_meds} onChange={set('pain_meds')} />
              </Field>
              <Field label="תרופות נוספות">
                <input className={inputCls} value={form.other_meds} onChange={set('other_meds')} />
              </Field>
            </div>
            <Field label="בדיקות הדמיה">
              <input className={inputCls} value={form.imaging} onChange={set('imaging')} placeholder="רנטגן, CT, MRI..." />
            </Field>
            <Field label="טיפולים קודמים">
              <input className={inputCls} value={form.previous_treatments} onChange={set('previous_treatments')} />
            </Field>
            <CheckField label="רגישות למגע" checked={form.touch_sensitivity} onChange={v => setVal('touch_sensitivity')(v)} />
          </div>
        </section>

        {/* Section 4: Environment */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>סביבה ואורח חיים</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="סוג מגורים">
                <select className={inputCls} value={form.housing_type} onChange={set('housing_type')}>
                  <option value="">בחר...</option>
                  <option>בית פרטי עם גינה</option>
                  <option>דירה</option>
                  <option>חצר</option>
                </select>
              </Field>
              <Field label="מס׳ טיולים ביום">
                <input type="number" className={inputCls} value={form.walks_per_day} onChange={set('walks_per_day')} />
              </Field>
              <Field label="משך טיול">
                <input className={inputCls} value={form.walk_duration} onChange={set('walk_duration')} placeholder="20 דק׳..." />
              </Field>
              <Field label="אופי פעילות">
                <input className={inputCls} value={form.activity_type} onChange={set('activity_type')} />
              </Field>
              <Field label="עלייה/ירידה מרכב">
                <select className={inputCls} value={form.car_access} onChange={set('car_access')}>
                  <option value="">בחר...</option>
                  <option>עולה בכוחות עצמו</option>
                  <option>עם עזרה</option>
                  <option>מורם</option>
                </select>
              </Field>
              <Field label="עלייה על ספות">
                <select className={inputCls} value={form.furniture_access} onChange={set('furniture_access')}>
                  <option value="">בחר...</option>
                  <option>כן</option>
                  <option>לא</option>
                  <option>עם עזרה</option>
                </select>
              </Field>
            </div>
            <div className="flex flex-wrap gap-4">
              <CheckField label="ריצוף מחליק" checked={form.slippery_floor} onChange={v => setVal('slippery_floor')(v)} />
              <CheckField label="קושי בקימה" checked={form.difficulty_rising} onChange={v => setVal('difficulty_rising')(v)} />
              <CheckField label="קושי במדרגות" checked={form.difficulty_stairs} onChange={v => setVal('difficulty_stairs')(v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="בעלי חיים נוספים">
                <input className={inputCls} value={form.other_pets} onChange={set('other_pets')} />
              </Field>
              <Field label="תזונה">
                <input className={inputCls} value={form.diet} onChange={set('diet')} />
              </Field>
              <Field label="תוספי תזונה">
                <input className={inputCls} value={form.supplements} onChange={set('supplements')} />
              </Field>
              <Field label="אביזרים">
                <input className={inputCls} value={form.accessories} onChange={set('accessories')} placeholder="קולר, רתמה..." />
              </Field>
            </div>
          </div>
        </section>

        {/* Section 5: Physical exam */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>בדיקה פיזיקאלית</SectionTitle>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="דפוס הליכה">
                <select className={inputCls} value={form.gait_pattern} onChange={set('gait_pattern')}>
                  <option value="">בחר...</option>
                  <option>תקין</option>
                  <option>צליעה קלה</option>
                  <option>צליעה</option>
                  <option>צליעה חמורה</option>
                  <option>לא נושא משקל</option>
                </select>
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">דרגת כאב (1-5)</label>
              <ScoreButtons value={form.pain_score} max={5} onChange={v => setVal('pain_score')(v)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">BCS (1-5)</label>
              <ScoreButtons value={form.bcs_score} max={5} onChange={v => setVal('bcs_score')(v)} />
            </div>

            <div className="space-y-3">
              <CheckField label="קרפיטציות" checked={form.crepitus} onChange={v => setVal('crepitus')(v)} />
              {form.crepitus && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="גף עם קרפיטציות">
                    <input className={inputCls} value={form.crepitus_limb} onChange={set('crepitus_limb')} />
                  </Field>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">עוצמה (1-3)</label>
                    <ScoreButtons value={form.crepitus_grade} max={3} onChange={v => setVal('crepitus_grade')(v)} />
                  </div>
                </div>
              )}
              <CheckField label="פיצויים" checked={form.compensations} onChange={v => setVal('compensations')(v)} />
              {form.compensations && (
                <Field label="פרטי פיצויים">
                  <input className={inputCls} value={form.compensation_details} onChange={set('compensation_details')} />
                </Field>
              )}
            </div>

            {/* Limb table */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">הערכת גפיים</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-start p-2.5 font-medium text-slate-600 border border-slate-200">גף</th>
                      <th className="text-start p-2.5 font-medium text-slate-600 border border-slate-200">ROM</th>
                      <th className="text-start p-2.5 font-medium text-slate-600 border border-slate-200">היקף (cm)</th>
                      <th className="text-start p-2.5 font-medium text-slate-600 border border-slate-200">כאב (1-5)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIMBS.map(limb => (
                      <tr key={limb}>
                        <td className="p-2.5 border border-slate-200 font-medium text-slate-700 whitespace-nowrap">{limb}</td>
                        {(['rom', 'circumference', 'pain'] as const).map(field => (
                          <td key={field} className="p-1.5 border border-slate-200">
                            <input
                              className="w-full border-0 bg-transparent text-sm focus:outline-none text-center"
                              value={limbData[limb][field]}
                              onChange={e =>
                                setLimbData(prev => ({
                                  ...prev,
                                  [limb]: { ...prev[limb], [field]: e.target.value },
                                }))
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Field label="הערות בדיקה">
              <textarea className={textareaCls} rows={3} value={form.exam_notes} onChange={set('exam_notes')} />
            </Field>
          </div>
        </section>

        {/* Section 6: Summary */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionTitle>תוכנית טיפול וסיכום</SectionTitle>
          <div className="space-y-4">
            <Field label="תוכנית טיפול">
              <textarea className={textareaCls} rows={4} value={form.treatment_plan} onChange={set('treatment_plan')} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="טיפולים בסדרה">
                <input type="number" className={inputCls} value={form.series_count} onChange={set('series_count')} />
              </Field>
              <Field label="שם המטפלת">
                <input className={inputCls} value={form.therapist_name} onChange={set('therapist_name')} />
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
            style={{ background: '#1D9E75' }}
          >
            {saving ? 'שומר...' : 'שמירת אבחון'}
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
