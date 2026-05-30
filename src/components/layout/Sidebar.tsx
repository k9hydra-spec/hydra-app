import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarDays, PawPrint, PlusCircle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { key: 'daily', icon: CalendarDays, to: '/' },
  { key: 'clients', icon: PawPrint, to: '/clients' },
  { key: 'newClient', icon: PlusCircle, to: '/clients/new' },
  { key: 'settings', icon: Settings, to: '/settings' },
] as const

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="flex flex-col flex-1 bg-white">
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1D9E75' }}>
            H
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-tight">HYDRA</p>
            <p className="text-xs text-slate-500 leading-tight">קליניקת שיקום</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              )
            }
            style={({ isActive }) =>
              isActive ? { background: '#1D9E75' } : {}
            }
          >
            <Icon size={18} />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
