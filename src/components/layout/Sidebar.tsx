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
      {/* Logo area */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-center">
        <img src="/logo.png" alt="HYDRA" className="h-20 w-auto object-contain" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-5 space-y-2">
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )
            }
            style={({ isActive }) => isActive ? { background: '#5BB8C5' } : {}}
          >
            <Icon size={19} />
            <span>{t(`nav.${key}`)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
