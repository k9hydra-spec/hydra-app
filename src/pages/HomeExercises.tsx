import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Download, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { getClient, getTreatments } from '@/lib/api'
import { loadSettings } from '@/lib/settings'
import type { Client, Treatment } from '@/lib/supabase'
import { HomeExercisesPDF, type ExerciseEntry } from '@/reports/HomeExercisesPDF'
import { cn } from '@/lib/utils'

const HYDRO_EXERCISES = [
  'Down to stand', 'Sit to stand', 'Weight shift', 'Orbit+donut',
  'Elevated front', 'Cavalleti', 'Infinity', 'Obstacle course',
  'Over and back', 'Wobble board', 'Cookie stretch', 'Stretch',
  'Land treadmill', '3 leg stance', 'Give paw', 'B.disc front',
  'Massage', 'B.disc all 4', 'B.disc back', 'Side stepping',
]

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'

export function HomeExercises() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const BackIcon = i18n.language === 'he' ? ChevronRight : ChevronLeft

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [clinicName, setClinicName] = useState(() => loadSettings().clinicName)
  const [clinicPhone, setClinicPhone] = useState(() => loadSettings().clinicPhone)
  const [therapistName, setTherapistName] = useState(() => loadSettings().therapistName)
  const [generalNote, setGeneralNote] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([getClient(id), getTreatments(id)])
      .then(([c, ts]) => {
        setClient(c)
        // Pre-populate from last treatment's active_exercises
        const last = ts.sort((a, b) => b.date.localeCompare(a.date))[0]
        if (last?.active_exercises) {
          const exs = last.active_exercises as ExerciseEntry[]
          if (Array.isArray(exs)) setExercises(exs)
        }
        if (last?.therapist_name) setTherapistName(last.therapist_name)
      })
      .finally(() => setLoading(false))
  }, [id])

  const toggleExercise = (name: string) => {
    if (exercises.find(e => e.name === name)) {
      setExercises(prev => prev.filter(e => e.name !== name))
    } else {
      setExercises(prev => [...prev, { name, reps: '', sets: '' }])
    }
  }

  const updateExercise = (name: string, field: 'reps' | 'sets' | 'note', value: string) =>
    setExercises(prev => prev.map(e => e.name === name ? { ...e, [field]: value } : e))

  if (loading) return <div className="max-w-2xl mx-auto animate-pulse"><div className="h-64 bg-white rounded-xl border border-slate-200 mt-6" /></div>
  if (!client) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
          <BackIcon size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">תרגילים ביתיים</h1>
          <p className="text-xs text-slate-500">{client.pet_name} · {client.owner_name}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Clinic + therapist */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">פרטים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">שם קליניקה</label>
              <input className={inputCls} value={clinicName} onChange={e => setClinicName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">טלפון</label>
              <input className={inputCls} value={clinicPhone} onChange={e => setClinicPhone(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">שם המטפלת</label>
              <input className={inputCls} value={therapistName} onChange={e => setTherapistName(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">הערה כללית</label>
              <input className={inputCls} value={generalNote} onChange={e => setGeneralNote(e.target.value)} placeholder="בצעו את התרגילים בסביבה שקטה..." />
            </div>
          </div>
        </section>

        {/* Exercise picker */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">
            בחירת תרגילים {exercises.length > 0 && `(${exercises.length} נבחרו)`}
          </h2>
          <div className="flex flex-wrap gap-2">
            {HYDRO_EXERCISES.map(ex => {
              const selected = !!exercises.find(e => e.name === ex)
              return (
                <button
                  key={ex}
                  type="button"
                  onClick={() => toggleExercise(ex)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                    selected ? 'text-white border-[#1D9E75]' : 'text-slate-600 border-slate-200 hover:border-[#1D9E75]/50'
                  )}
                  style={selected ? { background: '#1D9E75' } : {}}
                >
                  {ex}
                </button>
              )
            })}
          </div>
        </section>

        {/* Exercise details */}
        {exercises.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">פרטי תרגילים</h2>
            <div className="space-y-3">
              {exercises.map((ex, i) => (
                <div key={ex.name} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2.5">
                  <span className="text-xs text-slate-400 w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{ex.name}</span>
                  <input
                    type="number"
                    placeholder="חזרות"
                    value={ex.reps}
                    onChange={e => updateExercise(ex.name, 'reps', e.target.value)}
                    className="w-20 border border-slate-200 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:border-[#1D9E75]"
                  />
                  <span className="text-xs text-slate-400">×</span>
                  <input
                    type="number"
                    placeholder="סטים"
                    value={ex.sets}
                    onChange={e => updateExercise(ex.name, 'sets', e.target.value)}
                    className="w-20 border border-slate-200 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:border-[#1D9E75]"
                  />
                  <button type="button" onClick={() => toggleExercise(ex.name)} className="text-slate-300 hover:text-red-400 ms-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="pb-4">
          {exercises.length === 0 ? (
            <div className="w-full text-center py-3 rounded-xl bg-slate-100 text-slate-400 text-sm">
              בחרי לפחות תרגיל אחד
            </div>
          ) : !ready ? (
            <button
              onClick={() => setReady(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75' }}
            >
              הכן גיליון PDF
            </button>
          ) : (
            <PDFDownloadLink
              document={
                <HomeExercisesPDF
                  client={client}
                  exercises={exercises}
                  clinicName={clinicName}
                  clinicPhone={clinicPhone}
                  therapistName={therapistName}
                  generalNote={generalNote}
                />
              }
              fileName={`תרגילים_${client.pet_name}_${new Date().toISOString().slice(0, 10)}.pdf`}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75', textDecoration: 'none' }}
            >
              {({ loading: l }) => l ? <span>מכין...</span> : <><Download size={17} /> הורד גיליון תרגילים PDF</>}
            </PDFDownloadLink>
          )}
        </div>
      </div>
    </div>
  )
}
