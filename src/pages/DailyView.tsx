import { useTranslation } from 'react-i18next'
import { PlusCircle, Clock, X, Search, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getDailySchedule, addToDailySchedule, removeDailyEntry, getClients } from '@/lib/api'
import type { Client, DailySchedule } from '@/lib/supabase'

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

// Treatment type badge styles
const TREATMENT_STYLES: Record<string, { bg: string; color: string }> = {
  'טיפול משולב פיזיו+הידרו': { bg: '#E8EEF4', color: '#1B3A5C' },
  'פיזיותרפיה (30 דק׳)': { bg: '#DCEEf4', color: '#1B4F6A' },
  'הידרותרפיה (30 דק׳)': { bg: '#EAF6F9', color: '#1B5A72' },
  'פגישת ייעוץ (שעה)': { bg: '#EEF0F8', color: '#3A3D8A' },
  'לייזר/שוקוויב (30 דק׳)': { bg: '#FFF8EC', color: '#7A5500' },
  'התאמת עזרים (שעה)': { bg: '#F2F4F6', color: '#4A5568' },
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(27,58,92,0.35)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md" style={{ boxShadow: '0 8px 32px rgba(27,58,92,0.15)', border: '0.5px solid #D0D8E0' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid #D0D8E0' }}>
          <h2 className="font-semibold" style={{ color: '#1B3A5C' }}>הוספת לקוח ליום</h2>
          <button onClick={onClose} style={{ color: '#AAB8C5' }}>
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!selected ? (
            <div>
              <div className="relative mb-3">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ color: '#AAB8C5', insetInlineEnd: 11 }} />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="חיפוש לקוח..."
                  className="w-full rounded-lg text-sm focus:outline-none"
                  style={{ border: '0.5px solid #D0D8E0', padding: '10px 34px 10px 12px', color: '#1B3A5C' }}
                />
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {filtered.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c)}
                    className="w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                    style={{ color: '#1B3A5C' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#EAF6F9')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: '#2A6B8A' }}>
                      {c.pet_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.pet_name}</p>
                      <p className="text-xs" style={{ color: '#7A8A9A' }}>{c.owner_name}</p>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm py-4" style={{ color: '#AAB8C5' }}>לא נמצאו לקוחות</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#EAF6F9' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: '#2A6B8A' }}>
                  {selected.pet_name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#1B3A5C' }}>{selected.pet_name}</p>
                  <p className="text-xs" style={{ color: '#7A8A9A' }}>{selected.owner_name}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: '#AAB8C5' }}>
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B3A5C' }}>שעת הגעה</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full rounded-lg text-sm focus:outline-none"
                  style={{ border: '0.5px solid #D0D8E0', padding: '10px 12px', color: '#1B3A5C' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B3A5C' }}>סוג טיפול</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full rounded-lg text-sm focus:outline-none"
                  style={{ border: '0.5px solid #D0D8E0', padding: '10px 12px', color: '#1B3A5C' }}
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
              className="w-full text-sm font-semibold text-white py-3 rounded-xl transition-all disabled:opacity-60"
              style={{ background: '#1B3A5C' }}
              onMouseEnter={e => { if (!saving) (e.currentTarget.style.background = '#2A6B8A') }}
              onMouseLeave={e => { if (!saving) (e.currentTarget.style.background = '#1B3A5C') }}
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
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1B3A5C' }}>יום עבודה</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8A9A' }}>
            {isHe ? formatDateHebrew(date) : formatDateEnglish(date)}
          </p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-all"
          style={{ background: '#1B3A5C' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2A6B8A')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1B3A5C')}
        >
          <PlusCircle size={16} />
          הוספת לקוח
        </button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse" style={{ border: '0.5px solid #D0D8E0' }}>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full" style={{ background: '#E8EEF4' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded" style={{ background: '#E8EEF4' }} />
                  <div className="h-3 w-24 rounded" style={{ background: '#F0F4F8' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-xl p-10 text-center" style={{ border: '0.5px solid #D0D8E0' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#EAF6F9' }}>
            <ClipboardList size={24} style={{ color: '#7EC8D8' }} />
          </div>
          <p className="text-sm mb-3" style={{ color: '#7A8A9A' }}>אין לקוחות מתוכננים להיום</p>
          <button
            onClick={() => setShowDialog(true)}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
            style={{ border: '0.5px solid #2A6B8A', color: '#2A6B8A' }}
          >
            הוסיפי לקוח ליום
          </button>
        </div>
      ) : (
        /* Schedule list */
        <div className="space-y-3">
          {sorted.map((entry) => {
            const style = entry.treatment_type
              ? (TREATMENT_STYLES[entry.treatment_type] ?? { bg: '#F2F4F6', color: '#4A5568' })
              : null

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl p-4 transition-shadow hover:shadow-sm"
                style={{ border: '0.5px solid #D0D8E0' }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar + time */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: '#2A6B8A' }}
                    >
                      {entry.client.pet_name[0]}
                    </div>
                    {entry.arrival_time && (
                      <div className="flex items-center gap-0.5 text-xs" style={{ color: '#7A8A9A' }}>
                        <Clock size={10} />
                        {entry.arrival_time.slice(0, 5)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm" style={{ color: '#1B3A5C' }}>{entry.client.pet_name}</p>
                      {entry.client.pet_breed && (
                        <span className="text-xs" style={{ color: '#AAB8C5' }}>{entry.client.pet_breed}</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#7A8A9A' }}>{entry.client.owner_name}</p>
                    {style && (
                      <span
                        className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {entry.treatment_type}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/clients/${entry.client_id}/treatment/new`}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{ border: '0.5px solid #2A6B8A', color: '#2A6B8A' }}
                    >
                      תיעוד
                    </Link>
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="p-1 transition-colors"
                      style={{ color: '#D0D8E0' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#D0D8E0')}
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
