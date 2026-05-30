import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { getClient, getAssessments, getTreatments } from '@/lib/api'
import { loadSettings } from '@/lib/settings'
import type { Client, Assessment, Treatment } from '@/lib/supabase'
import { VetLetterPDF } from '@/reports/VetLetterPDF'

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'
const textareaCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] resize-none'

export function VetLetter() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const BackIcon = i18n.language === 'he' ? ChevronRight : ChevronLeft

  const [client, setClient] = useState<Client | null>(null)
  const [assessment, setAssessment] = useState<Assessment | undefined>()
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  const [clinicName, setClinicName] = useState(() => loadSettings().clinicName)
  const [clinicPhone, setClinicPhone] = useState(() => loadSettings().clinicPhone)
  const [clinicAddress, setClinicAddress] = useState(() => loadSettings().clinicAddress)
  const [therapistName, setTherapistName] = useState(() => loadSettings().therapistName)
  const [progress, setProgress] = useState('')
  const [recommendations, setRecommendations] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([getClient(id), getAssessments(id), getTreatments(id)])
      .then(([c, a, t]) => {
        setClient(c)
        setAssessment(a[0])
        setTreatments(t.sort((x, y) => y.date.localeCompare(x.date)))
        if (t.length > 0) {
          setProgress(t[0].progress ?? '')
          setRecommendations(t[0].recommendations ?? '')
          setTherapistName(t[0].therapist_name ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-2xl mx-auto animate-pulse"><div className="h-64 bg-white rounded-xl border border-slate-200 mt-6" /></div>
  if (!client) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
          <BackIcon size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">מכתב לוטרינר</h1>
          <p className="text-xs text-slate-500">{client.pet_name} · {client.owner_name}</p>
        </div>
      </div>

      <div className="space-y-5">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">פרטי הקליניקה</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">שם הקליניקה</label>
              <input className={inputCls} value={clinicName} onChange={e => setClinicName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">טלפון</label>
              <input className={inputCls} value={clinicPhone} onChange={e => setClinicPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">כתובת</label>
              <input className={inputCls} value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">שם המטפלת</label>
              <input className={inputCls} value={therapistName} onChange={e => setTherapistName(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">תוכן המכתב</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">התקדמות</label>
              <textarea className={textareaCls} rows={4} value={progress} onChange={e => setProgress(e.target.value)} placeholder="תארי את ההתקדמות שנצפתה בטיפולים..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">המלצות</label>
              <textarea className={textareaCls} rows={4} value={recommendations} onChange={e => setRecommendations(e.target.value)} placeholder="המלצות להמשך טיפול..." />
            </div>
          </div>
        </section>

        {/* Preview summary */}
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">תצוגה מקדימה</h2>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">מטופל</span>
            <span className="font-medium text-slate-800">{client.pet_name}</span>
          </div>
          {client.vet_name && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">נמען</span>
              <span className="font-medium text-slate-800">{client.vet_name}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">טיפולים</span>
            <span className="font-medium text-slate-800">{treatments.length}</span>
          </div>
        </section>

        <div className="pb-4">
          {!ready ? (
            <button
              onClick={() => setReady(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75' }}
            >
              הכן מכתב PDF
            </button>
          ) : (
            <PDFDownloadLink
              document={
                <VetLetterPDF
                  client={client}
                  assessment={assessment}
                  treatments={treatments}
                  clinicName={clinicName}
                  clinicPhone={clinicPhone}
                  clinicAddress={clinicAddress}
                  therapistName={therapistName}
                  progress={progress}
                  recommendations={recommendations}
                />
              }
              fileName={`מכתב_וטרינר_${client.pet_name}_${new Date().toISOString().slice(0, 10)}.pdf`}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75', textDecoration: 'none' }}
            >
              {({ loading: l }) => l ? <span>מכין...</span> : <><Download size={17} /> הורד מכתב PDF</>}
            </PDFDownloadLink>
          )}
        </div>
      </div>
    </div>
  )
}
