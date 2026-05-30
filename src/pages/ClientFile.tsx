import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, PlusCircle, FileText, Stethoscope, ClipboardList } from 'lucide-react'
import { getClient, getAssessments, getTreatments } from '@/lib/api'
import type { Client, Assessment, Treatment } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'medical', icon: Stethoscope, label: 'מידע רפואי' },
  { id: 'treatments', icon: ClipboardList, label: 'טיפולים' },
  { id: 'reports', icon: FileText, label: 'דוחות' },
] as const

type Tab = typeof TABS[number]['id']

function InfoRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === '') return null
  const display = typeof value === 'boolean' ? (value ? 'כן' : 'לא') : String(value)
  return (
    <div className="flex gap-2 py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm w-36 shrink-0">{label}</span>
      <span className="text-slate-800 text-sm font-medium">{display}</span>
    </div>
  )
}

export function ClientFile() {
  const { id } = useParams<{ id: string }>()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isHe = i18n.language === 'he'
  const [tab, setTab] = useState<Tab>('medical')

  const [client, setClient] = useState<Client | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getClient(id), getAssessments(id), getTreatments(id)])
      .then(([c, a, t]) => {
        setClient(c)
        setAssessments(a)
        setTreatments(t)
      })
      .finally(() => setLoading(false))
  }, [id])

  const BackIcon = isHe ? ChevronRight : ChevronLeft
  const latestAssessment = assessments[0]

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200 rounded-xl" />
        <div className="h-8 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-white rounded-xl border border-slate-200" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-slate-500">לקוח לא נמצא</p>
        <Link to="/clients" className="text-[#1D9E75] text-sm mt-2 inline-block">חזרה לרשימה</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <BackIcon size={20} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0"
            style={{ background: '#1D9E75' }}
          >
            {client.pet_name[0]}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              {client.pet_name}
              {client.pet_breed && <span className="font-normal text-slate-500 text-sm"> · {client.pet_breed}</span>}
            </h1>
            <p className="text-xs text-slate-500">{client.owner_name}{client.owner_phone && ` · ${client.owner_phone}`}</p>
          </div>
        </div>
        <Link
          to={`/clients/${id}/treatment/new`}
          className="flex items-center gap-1.5 text-sm font-medium text-white px-3 py-2 rounded-lg hover:opacity-90 transition-colors shrink-0"
          style={{ background: '#1D9E75' }}
        >
          <PlusCircle size={15} />
          תיעוד טיפול
        </Link>
      </div>

      <div className="flex border-b border-slate-200 mb-5 gap-1">
        {TABS.map(({ id: tid, icon: Icon, label }) => (
          <button
            key={tid}
            onClick={() => setTab(tid)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === tid
                ? 'border-[#1D9E75] text-[#1D9E75]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'medical' && (
        <div className="space-y-4">
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-3">פרטי בעל החיים</h2>
            <InfoRow label="שם" value={client.pet_name} />
            <InfoRow label="גזע" value={client.pet_breed} />
            <InfoRow label="תאריך לידה" value={client.pet_dob} />
            <InfoRow label="מין" value={client.pet_sex} />
            <InfoRow label="מעוקר" value={client.pet_neutered} />
            <InfoRow label='משקל (ק"ג)' value={client.pet_weight} />
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-3">פרטי הבעלים</h2>
            <InfoRow label="שם" value={client.owner_name} />
            <InfoRow label="טלפון" value={client.owner_phone} />
            <InfoRow label="אימייל" value={client.owner_email} />
            <InfoRow label="כתובת" value={client.owner_address} />
            <InfoRow label="וטרינר" value={client.vet_name} />
            <InfoRow label="גורם מפנה" value={client.referrer} />
            <InfoRow label="ביטוח" value={client.insurance_company} />
          </section>

          {latestAssessment ? (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide">אבחון ראשוני</h2>
                <span className="text-xs text-slate-400">{latestAssessment.date}</span>
              </div>
              <InfoRow label="סיבת הגעה" value={latestAssessment.reason} />
              <InfoRow label="תלונה עיקרית" value={latestAssessment.chief_complaint} />
              <InfoRow label="גף מושפע" value={latestAssessment.affected_limb} />
              <InfoRow label="דפוס הליכה" value={latestAssessment.gait_pattern} />
              <InfoRow label="דרגת כאב" value={latestAssessment.pain_score ? `${latestAssessment.pain_score}/5` : undefined} />
              <InfoRow label="BCS" value={latestAssessment.bcs_score ? `${latestAssessment.bcs_score}/5` : undefined} />
              <InfoRow label="תוכנית טיפול" value={latestAssessment.treatment_plan} />
              <InfoRow label="טיפולים בסדרה" value={latestAssessment.series_count} />
            </section>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-slate-500 text-sm mb-3">אין אבחון ראשוני</p>
              <Link
                to={`/clients/${id}/assessment/new`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1D9E75] hover:underline"
              >
                <PlusCircle size={15} />
                הוסף אבחון
              </Link>
            </div>
          )}
        </div>
      )}

      {tab === 'treatments' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Link
              to={`/clients/${id}/treatment/new`}
              className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75' }}
            >
              <PlusCircle size={15} />
              תיעוד טיפול חדש
            </Link>
          </div>

          {treatments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500 text-sm">אין טיפולים מתועדים</p>
            </div>
          ) : (
            treatments.map((t, i) => (
              <div
                key={t.id}
                className={cn(
                  'bg-white rounded-xl border p-4',
                  i === 0 ? 'border-[#1D9E75]/40 ring-1 ring-[#1D9E75]/20' : 'border-slate-200'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{t.date}</span>
                    {t.in_series && (
                      <span className="ms-2 text-xs bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full">
                        {t.series_number}/{t.series_total}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{t.treatment_type}</span>
                </div>
                {t.progress && (
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="text-slate-400">התקדמות: </span>{t.progress}
                  </p>
                )}
                {t.recommendations && (
                  <p className="text-sm text-slate-600">
                    <span className="text-slate-400">המלצה: </span>{t.recommendations}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-3">
          {[
            { label: 'דוח לביטוח', desc: 'יצירת דוח אוטומטי לחברת הביטוח', to: 'reports/insurance' },
            { label: 'מכתב לוטרינר', desc: 'מכתב מקצועי לוטרינר המפנה', to: 'reports/vet-letter' },
            { label: 'תרגילים ביתיים', desc: 'גיליון תרגילים ללקוח', to: 'reports/home-exercises' },
          ].map(({ label, desc, to }) => (
            <Link
              key={to}
              to={`/clients/${id}/${to}`}
              className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-[#1D9E75]/40 hover:shadow-sm transition-all group"
            >
              <div>
                <p className="font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <ChevronLeft size={16} className="text-slate-300 group-hover:text-[#1D9E75] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
