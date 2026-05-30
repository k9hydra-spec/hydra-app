import { useTranslation } from 'react-i18next'
import { PlusCircle, Clock, ChevronLeft, ChevronRight, X, Search, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getDailySchedule, addToDailySchedule, removeDailyEntry, getClients } from '@/lib/api'
import type { Client, DailySchedule } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const TREATMENT_TYPES = [
  'פגישת ייעוץ (שעה)',
  'טיפול משולב פיזיו+הידרו',
  'פיזיותרפיה (30 דק׳)',
  'הידרותרפיה (30 דק׳)',
  'לייזר/שוקוויב (30 דק׳)',
  'התאמת עזרים (שעה)',
]

type ScheduleEntry = DailySchedule & { client: Client }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDateHebrew(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatDateEnglish(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

const TREATMENT_COLORS: Record<string, string> = {
  'פגישת ייעוץ (שעה)': 'bg-purple-50 text-purple-700 border-purple-100',
  'טיפול משולב פיזיו+הידרו': 'bg-blue-50 text-blue-700 border-blue-100',
  'פיזיותרפיה (30 דק׳)': 'bg-orange-50 text-orange-700 border-orange-100',
  'הידרותרפיה (30 דק׳)': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'לייזר/שוקוויב (30 דק׳)': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'התאמת עזרים (שעה)': 'bg-slate-50 text-slate-700 border-slate-200',
}

function AddClientDialog({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (clientId: string, time: string, type: string) => Promise<void>
}) {
  const [allClients, setAllClients] = useState<Client[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)
  const [time, setTime] = useState('')
  const [type, setType] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { getClients().then(setAllClients) }, [])

  const filtered = allClients.filter(c =>
    c.pet_name.toLowerCase().includes(query.toLowerCase()) ||
    c.owner_name.toLowerCase().includes(query.toLowerCase())
  )

  const handleAdd = async () => {
    if (!selected) return
    setSaving(true)
    await onAdd(selected.id, time, type)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">הוספת לקוח ליום</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!selected ? (
            <div>
              <div className="relative mb-3">
                <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="חיפוש לקוח..."
                  className="w-full border border-slate-200 rounded-lg ps-9 pe-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                />
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {filtered.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c)}
                    className="w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: '#1D9E75' }}
                    >
                      {c.pet_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{c.pet_name}</p>
                      <p className="text-xs text-slate-500">{c.owner_name}</p>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4">לא נמצאו לקוחות</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-[#1D9E75]/10 rounded-xl px-4 py-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: '#1D9E75' }}
                >
                  {selected.pet_name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{selected.pet_name}</p>
                  <p className="text-xs text-slate-500">{selected.owner_name}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">שעת הגעה</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">סוג טיפול</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                >
                  <option value="">בחר...</option>
                  {TREATMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="px-5 pb-5">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="w-full text-sm font-medium text-white py-3 rounded-xl hover:opacity-90 transition-colors disabled:opacity-60"
              style={{ background: '#1D9E75' }}
            >
              {saving ? 'מוסיף...' : 'הוספה ליום'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function DailyView() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const [date] = useState(todayISO())
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  const loadSchedule = () => {
    setLoading(true)
    getDailySchedule(date)
      .then(data => setSchedule(data as ScheduleEntry[]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSchedule() }, [date])

  const handleAdd = async (clientId: string, time: string, type: string) => {
    await addToDailySchedule({
      date,
      client_id: clientId,
      arrival_time: time || undefined,
      treatment_type: type || undefined,
      order_index: schedule.length,
    })
    loadSchedule()
  }

  const handleRemove = async (id: string) => {
    await removeDailyEntry(id)
    loadSchedule()
  }

  const sorted = [...schedule].sort((a, b) => {
    if (!a.arrival_time && !b.arrival_time) return 0
    if (!a.arrival_time) return 1
    if (!b.arrival_time) return -1
    return a.arrival_time.localeCompare(b.arrival_time)
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">יום עבודה</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isHe ? formatDateHebrew(date) : formatDateEnglish(date)}
          </p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
          style={{ background: '#1D9E75' }}
        >
          <PlusCircle size={16} />
          הוספת לקוח ליום
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm mb-1">אין לקוחות מתוכננים להיום</p>
          <button
            onClick={() => setShowDialog(true)}
            className="text-sm text-[#1D9E75] hover:underline mt-1"
          >
            הוסיפי לקוח ליום
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((entry, i) => {
            const colorCls = entry.treatment_type
              ? (TREATMENT_COLORS[entry.treatment_type] ?? 'bg-slate-50 text-slate-700 border-slate-200')
              : ''
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: '#1D9E75' }}
                    >
                      {entry.client.pet_name[0]}
                    </div>
                    {entry.arrival_time && (
                      <div className="flex items-center gap-0.5 text-xs text-slate-400">
                        <Clock size={10} />
                        {entry.arrival_time.slice(0, 5)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800">{entry.client.pet_name}</p>
                      {entry.client.pet_breed && (
                        <span className="text-xs text-slate-400">{entry.client.pet_breed}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{entry.client.owner_name}</p>
                    {entry.treatment_type && (
                      <span className={cn('inline-block mt-2 text-xs px-2 py-0.5 rounded-full border', colorCls)}>
                        {entry.treatment_type}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/clients/${entry.client_id}/treatment/new`}
                      className="text-xs font-medium text-[#1D9E75] border border-[#1D9E75]/30 px-2.5 py-1.5 rounded-lg hover:bg-[#1D9E75]/10 transition-colors"
                    >
                      תיעוד
                    </Link>
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showDialog && (
        <AddClientDialog
          onClose={() => setShowDialog(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
