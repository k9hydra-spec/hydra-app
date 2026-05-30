import { useTranslation } from 'react-i18next'
import { Search, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getClients } from '@/lib/api'
import type { Client } from '@/lib/supabase'
import { cn } from '@/lib/utils'

function getAge(dob?: string) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

export function Clients() {
  const { t, i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const [query, setQuery] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c => {
    const q = query.toLowerCase()
    return (
      c.pet_name.toLowerCase().includes(q) ||
      c.owner_name.toLowerCase().includes(q) ||
      (c.pet_breed?.toLowerCase() ?? '').includes(q)
    )
  })

  const ChevronEnd = isHe ? ChevronLeft : ChevronRight

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">{t('clients.title')}</h1>
        <Link
          to="/clients/new"
          className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
          style={{ background: '#1D9E75' }}
        >
          <PlusCircle size={16} />
          {t('clients.newClient')}
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('clients.search')}
          className="w-full bg-white border border-slate-200 rounded-lg ps-9 pe-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 text-sm">שגיאה בטעינת הנתונים: {error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500 text-sm">
            {clients.length === 0 ? 'אין לקוחות עדיין — הוסיפי לקוח חדש' : t('clients.noResults')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(client => {
            const age = getAge(client.pet_dob)
            return (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3.5 hover:border-[#1D9E75]/40 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: '#1D9E75' }}
                  >
                    {client.pet_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">
                      {client.pet_name}
                      {client.pet_breed && (
                        <span className="font-normal text-slate-500 text-sm"> · {client.pet_breed}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {client.owner_name}
                      {age !== null && ` · גיל ${age}`}
                      {client.pet_weight && ` · ${client.pet_weight} ק"ג`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {client.insurance_company && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                      {client.insurance_company}
                    </span>
                  )}
                  <ChevronEnd size={16} className="text-slate-300 group-hover:text-[#1D9E75] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
