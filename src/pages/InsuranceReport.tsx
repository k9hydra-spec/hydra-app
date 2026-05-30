import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Download, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { getClient, getAssessments, getTreatments } from '@/lib/api'
import { loadSettings } from '@/lib/settings'
import type { Client, Assessment, Treatment } from '@/lib/supabase'
import { InsuranceReportPDF } from '@/reports/InsuranceReportPDF'
import { cn } from '@/lib/utils'

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]'

export function InsuranceReport() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const BackIcon = isHe ? ChevronRight : ChevronLeft

  const [client, setClient] = useState<Client | null>(null)
  const [assessment, setAssessment] = useState<Assessment | undefined>()
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)

  // Report settings
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10))
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [clinicName, setClinicName] = useState(() => loadSettings().clinicName)
  const [clinicPhone, setClinicPhone] = useState(() => loadSettings().clinicPhone)
  const [clinicAddress, setClinicAddress] = useState(() => loadSettings().clinicAddress)
  const [therapistName, setTherapistName] = useState(() => loadSettings().therapistName)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getClient(id), getAssessments(id), getTreatments(id)])
      .then(([c, a, t]) => {
        setClient(c)
        setAssessment(a[0])
        setTreatments(t)
        if (t.length > 0) setDateFrom(t[t.length - 1].date)
        if (a[0]?.therapist_name) setTherapistName(a[0].therapist_name)
      })
      .finally(() => setLoading(false))
  }, [id])

  const filteredCount = treatments.filter(t => {
    if (dateFrom && t.date < dateFrom) return false
    if (dateTo && t.date > dateTo) return false
    return true
  }).length

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-64 bg-white rounded-xl border border-slate-200" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-slate-500">לקוח לא נמצא</p>
      </div>
    )
  }

  const pdfDoc = (
    <InsuranceReportPDF
      client={client}
      assessment={assessment}
      treatments={treatments}
      clinicName={clinicName}
      clinicPhone={clinicPhone}
      clinicAddress={clinicAddress}
      therapistName={therapistName}
      dateFrom={dateFrom || undefined}
      dateTo={dateTo || undefined}
      includeRecommendations={includeRecommendations}
    />
  )

  const fileName = `דוח_ביטוח_${client.pet_name}_${new Date().toISOString().slice(0, 10)}.pdf`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <BackIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">דוח לביטוח</h1>
          <p className="text-xs text-slate-500">{client.pet_name} · {client.owner_name}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1D9E75]/10 rounded-xl px-3 py-2">
          <FileText size={15} className="text-[#1D9E75]" />
          <span className="text-sm font-semibold text-[#1D9E75]">{filteredCount} טיפולים</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Clinic details */}
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

        {/* Date range */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">טווח תאריכים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">מתאריך</label>
              <input type="date" className={inputCls} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">עד תאריך</label>
              <input type="date" className={inputCls} value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {filteredCount === 0
              ? 'אין טיפולים בטווח זה'
              : `${filteredCount} טיפולים ייכללו בדוח`}
          </p>
        </section>

        {/* Options */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wide mb-4">אפשרויות הדוח</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeRecommendations}
              onChange={e => setIncludeRecommendations(e.target.checked)}
              className="w-4 h-4 accent-[#1D9E75]"
            />
            <span className="text-sm text-slate-700">כלול סיכום והמלצות</span>
          </label>
        </section>

        {/* Summary preview */}
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">תצוגה מקדימה</h2>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">לקוח</span>
            <span className="font-medium text-slate-800">{client.pet_name} / {client.owner_name}</span>
          </div>
          {client.insurance_company && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ביטוח</span>
              <span className="font-medium text-slate-800">{client.insurance_company}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">טיפולים</span>
            <span className="font-medium text-slate-800">{filteredCount}</span>
          </div>
          {assessment && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">אבחנה</span>
              <span className="font-medium text-slate-800 text-end max-w-[60%]">{assessment.chief_complaint}</span>
            </div>
          )}
        </section>

        {/* Download button */}
        <div className="pb-4">
          {filteredCount === 0 ? (
            <div className="w-full text-center py-3 rounded-xl bg-slate-100 text-slate-400 text-sm">
              אין טיפולים בטווח — בחרי תאריכים
            </div>
          ) : !ready ? (
            <button
              onClick={() => setReady(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75' }}
            >
              <FileText size={17} />
              הכן קובץ PDF
            </button>
          ) : (
            <PDFDownloadLink
              document={pdfDoc}
              fileName={fileName}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl hover:opacity-90 transition-colors"
              style={{ background: '#1D9E75', textDecoration: 'none' }}
            >
              {({ loading: pdfLoading }) =>
                pdfLoading ? (
                  <span>מכין PDF...</span>
                ) : (
                  <>
                    <Download size={17} />
                    הורד דוח PDF
                  </>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>
    </div>
  )
}
