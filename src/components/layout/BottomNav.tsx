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

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="md:hidden fixed bottom-0 start-0 end-0 bg-white border-t border-slate-200 z-50 safe-area-pb">
      <div className="flex">
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                isActive ? 'text-[#1D9E75]' : 'text-slate-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="leading-none">{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
